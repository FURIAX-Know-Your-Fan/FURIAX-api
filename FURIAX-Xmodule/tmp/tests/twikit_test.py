from twikit import Client, TooManyRequests
import time
from datetime import datetime
import csv
from dotenv import load_dotenv
from random import randint
import os

load_dotenv()

MINIMUN_TWEETS = 10
QUERY = "from:cwtshh__"

## CREDENTIALS
username = os.getenv("USERNAME")
password = os.getenv("PASSWORD")
email = os.getenv("EMAIL")

## AUTENTICACAO
client = Client(
    user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
)
client.login(auth_info_1=username, auth_info_2=email, password=password)
client.save_cookies('cookies.json')