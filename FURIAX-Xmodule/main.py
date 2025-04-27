from fastapi import FastAPI
from pathlib import Path
from bson import ObjectId
import twikit
import os
import asyncio
import json
from datetime import datetime
from pymongo import MongoClient
import logging
from pydantic import BaseModel
from fastapi import Body
from motor.motor_asyncio import AsyncIOMotorClient
import requests
import re


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

file_path = Path("cookies.json")

client = twikit.Client(language="en", user_agent="Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0")
mongo_url = os.getenv("MONGO_URL")
logger.info(f"MONGO_URL: {mongo_url}")  # Usando logger para imprimir

try: 
    mongo_client = AsyncIOMotorClient(mongo_url)
    db = mongo_client["test"]
    collection = db["user_tweets"]
    user_collection = db["users"]

    logger.info("MongoDB connection established")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")

if file_path.exists():
    print("cookies.json exists")

    client.load_cookies('cookies.json')

else:
    print("File does not exist")
    username = os.getenv("TWITTER_USERNAME")
    password = os.getenv("TWITTER_PASSWORD")
    email = os.getenv("TWITTER_EMAIL")

    async def login():
        await client.login(auth_info_1=username, auth_info_2=email, password=password)
        client.save_cookies('cookies.json')
        print("cookies saved")

    asyncio.run(login())

    
        

@app.get("/")
def read_root():
    return {"Hello": "World"}


class TweetRequest(BaseModel):
    screen_name: str
    local_id: str

@app.post("/tweets/")
async def get_user_tweets(data: TweetRequest):
    screen_name = data.screen_name
    local_id = data.local_id

    if not screen_name or not local_id:
        logger.error("screen_name and local_id are required")
        return {"error": "screen_name and local_id are required"}
        
    user = await client.get_user_by_screen_name(screen_name)
    user_id = user.id

    tweets = await client.get_user_tweets(user_id=user_id, tweet_type="Tweets", count=10)
    tweets_data = []

    refered_user = user_collection.find_one({"_id": ObjectId(local_id)})

    for tweet in tweets:
        tweet_data = {
            "id": tweet.id,
            "text": tweet.text,
            "created_at": tweet.created_at.isoformat() if isinstance(tweet.created_at, datetime) else str(tweet.created_at),
            "retweet_count": tweet.retweet_count,
            "favorite_count": tweet.favorite_count
        }
        tweets_data.append(tweet_data)

    mongo_doc = {
        "screen_name": screen_name,
        "tweets": tweets_data,
        "updated_at": datetime.utcnow().isoformat()
    }

    try:
        # Utilize upsert diretamente, o que é adequado para adicionar ou atualizar o documento.
        collection.update_one(
            {"user_id": ObjectId(local_id)},
            {"$set": mongo_doc},
             # Atualiza o documento se já existir
            upsert=True  # Se o usuário não existir, cria um novo documento
        )
        logger.info(f"Tweets salvos em um único documento para o usuário {screen_name}")
    except Exception as e:
        logger.error(f"Erro ao salvar tweets no MongoDB: {e}")
        return {"error": str(e)}

    with open(f"tweets_{screen_name}.json", 'w', encoding='utf-8') as f:
        json.dump(mongo_doc, f, ensure_ascii=False, indent=4)

    return {"message": "Tweets salvos com sucesso", "count": len(tweets_data), "tweets": tweets_data}


@app.get("/generate/user/score")
async def generate_users_score():
    users = await user_collection.find().to_list()
    
    for user in users:
        if not user["twitter_account"]:
            logger.warning(f"Usuário {user['_id']} não possui conta do Twitter")
            continue

        logger.info(f"Calculando score para o usuário {user['twitter_account']}")

        tweets = await collection.find_one({"user_id": user["_id"]})
        if not tweets:
            logger.warning(f"Nenhum tweet encontrado para o usuário {user['twitter_account']}")
            continue
        
        user_description_input = "Estes são os tweets do usuário:\n\n"

        for tweet in tweets["tweets"]:
            # logger.info(f"Tweet: {tweet['text']}")
            user_description_input += f"*{tweet['text']}*\n\n"

        user_description_input += 'Forneça uma breve descrição sobre o quão fã o usuário é do time de Esports brasileiro FURIA, com base nos tweets abaixo. Se não houver tweets sobre a FURIA, descreva que o usuário não é fã do time. Ao final, forneça a classificação de envolvimento com o time, usando uma das seguintes categorias: Não Medido, Casual, Engajado, Hardcore. Os tweets são delimitados por * *. Responda no formato JSON com as chaves description e enthusiast_level: {"description": "breve descrição sobre o fã do time FURIA", "enthusiast_level": "classificação de envolvimento'

        try:
            # Enviando dados no formato JSON
            payload = {
                "model": "gemma3:4b",
                "prompt": user_description_input,
                "stream": False
            }
            headers = {"Content-Type": "application/json"}  # Garantindo que o conteúdo seja JSON
            
            # Requisição POST para a API do Ollama
            response = requests.post(
                "https://d232-2804-14c-65d6-419e-00-1b94.ngrok-free.app/api/generate",
                data=json.dumps(payload),  # Convertendo o payload para JSON
                headers=headers
            )
            
            # Verificando a resposta da API
            if response.status_code == 200:
                json_text_cleaned = response.json()["response"].strip('```json\n').strip('```')
                data = json.loads(json_text_cleaned)

                
                user_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": {
                        "description": data["description"],
                        "enthusiast_level": data["enthusiast_level"]
                    }}
                )

                logger.info(f"Descrição e nível de entusiasta atualizados para o usuário {user['twitter_account']}")
            else:
                logger.error(f"Erro ao chamar a API. Status code: {response.status_code}, Resposta: {response.text}")

        except requests.exceptions.RequestException as e:
            # Capturando exceções relacionadas a requisições
            logger.error(f"Erro ao gerar descrição para o usuário {user['twitter_account']}: {e}")

    return {"message": "Scores gerados com sucesso"}
        
        