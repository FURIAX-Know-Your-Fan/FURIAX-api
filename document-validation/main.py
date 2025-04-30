from fastapi import FastAPI, File, UploadFile, Form
import os
import shutil
import pytesseract
from PIL import Image
import logging
import re
from deepface import DeepFace
from fastapi.middleware.cors import CORSMiddleware
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_cpf(text: str) -> str | None:
    cpf_pattern = r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b"
    match = re.search(cpf_pattern, text)
    return match.group(0) if match else None

def get_image_hash(image_path):
    with open(image_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

@app.post("/validate/documents")
async def validate_documents(document: UploadFile = File(...), selfie: UploadFile = File(...), user_cpf: str = Form(...)):
    doc_path = os.path.join(UPLOAD_DIR, document.filename)
    self_path = os.path.join(UPLOAD_DIR, selfie.filename)


    with open(doc_path, "wb") as doc_file:
        shutil.copyfileobj(document.file, doc_file)
    with open(self_path, "wb") as selfie_file:
        shutil.copyfileobj(selfie.file, selfie_file)
  
    if get_image_hash(doc_path) == get_image_hash(self_path):
        return {"success": False, "error": "As imagens enviadas são idênticas."}
    
    # OCR
    text = pytesseract.image_to_string(Image.open(doc_path), lang="por")

    logger.info(f"Extracted text: {text}")
    extracted_cpf = extract_cpf(text)
    if not extracted_cpf:
        return {"success": False, "error": "CPF não encontrado no documento."}       
    logger.info(f"Extracted CPF: {extracted_cpf}")
    logger.info(f"user_cpf: {user_cpf}")

    if extracted_cpf != user_cpf:
        return {"success": False, "error": "CPF do documento não confere com o CPF do usuário."}
    
    logger.info("CPF conferido com sucesso.")


    try:
        result = DeepFace.verify(doc_path, self_path, enforce_detection=False)
        
        if result["verified"]:
            logger.info("Selfie conferida com sucesso.")

            # deletar arquivos


            os.remove(doc_path)
            os.remove(self_path)
            logger.info("Arquivos deletados com sucesso.")
            return {"success": True, "message": "Selfie e cpf conferidos com sucesso."}
        else:
            logger.info("Selfie não conferida.")
            os.remove(doc_path)
            os.remove(self_path)
            return {"success": False, "error": "Selfie não conferida."}

    except Exception as e:
        return {"success": False, "error": str(e)}