import os 
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv('Python\.env'))

# print(os.getenv('MusicSyncClientID'))

CLIENT_ID = os.getenv('MusicSyncClientID')
CLIENT_SECRET = os.getenv('MusicSyncClientSecret')
REDIRECT_URI = os.getenv('MusicSyncRedirectURI')
