from fastapi import FastAPI
from pathlib import Path
import twikit
import os
import asyncio
import json
from datetime import datetime
from pymongo import MongoClient
import logging
from pydantic import BaseModel
from fastapi import Body


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

file_path = Path("cookies.json")

client = twikit.Client(language="en", user_agent="Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0")
mongo_url = os.getenv("MONGO_URL")
logger.info(f"MONGO_URL: {mongo_url}")  # Usando logger para imprimir

try: 
    mongo_client = MongoClient(mongo_url)
    db = mongo_client["tweets"]
    collection = db["tweets"]

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

    user = await client.get_user_by_screen_name(screen_name)
    user_id = user.id

    tweets = await client.get_user_tweets(user_id=user_id, tweet_type="Tweets", count=10)
    tweets_data = []

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
        "user_id": local_id,
        "screen_name": screen_name,
        "tweets": tweets_data,
        "updated_at": datetime.utcnow().isoformat()
    }

    try:
        collection.update_one(
            {"user_id": local_id},
            {"$set": mongo_doc},
            upsert=True
        )
        logger.info(f"Tweets salvos em um único documento para o usuário {screen_name}")
    except Exception as e:
        logger.error(f"Erro ao salvar tweets no MongoDB: {e}")
        return {"error": str(e)}

    with open(f"tweets_{screen_name}.json", 'w', encoding='utf-8') as f:
        json.dump(mongo_doc, f, ensure_ascii=False, indent=4)

    return {"message": "Tweets salvos com sucesso", "count": len(tweets_data)}


