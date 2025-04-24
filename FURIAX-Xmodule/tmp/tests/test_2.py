import twikit
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

MINIMUN_TWEETS = 10
username = os.getenv("TWITTER_USERNAME")
password = os.getenv("TWITTER_PASSWORD")
email = os.getenv("TWITTER_EMAIL")

print(username)
print(password)
print(email)


client = twikit.Client(language="en", user_agent="Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0")

async def login():
    await client.login(auth_info_1=username, auth_info_2=email, password=password)
    client.save_cookies('cookies.json')

# asyncio.run(login())

client.load_cookies('cookies.json')

tweet_count = 0

async def get_user_tweets(screen_name: str):
    user = await client.get_user_by_screen_name(screen_name)
    user_id = user.id

    tweets = await client.get_user_tweets(user_id=user_id, tweet_type="Tweets", count=MINIMUN_TWEETS)

    for tweet in tweets:
        print(f"Created at: {tweet.created_at}")
        print(f"Tweet ID: {tweet.id}")
        print(f"Tweet text: {tweet.text}")

asyncio.run(get_user_tweets("cwtshh_"))

# async def get_tweets_query(query: str):
#     tweets = await client.search_tweet(query=query, count=MINIMUN_TWEETS, product="Latest")

#     for tweet in tweets:
#         print(tweet)

# asyncio.run(get_tweets_query("from:cwtshh__"))
