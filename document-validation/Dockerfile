FROM python:3.10-slim

WORKDIR /app

RUN apt update

RUN apt install -y tesseract-ocr tesseract-ocr-por

RUN apt install cmake -y

RUN pip install face_recognition

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8002

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"]
