from requests import post , get
from .models import SpotifyToken
from .credentials import CLIENT_ID, CLIENT_SECRET
from django.utils import timezone
from django.contrib.auth import get_user_model
from datetime import timedelta


BASE_URL = "https://api.spotify.com/v1/me/"

user = get_user_model()

def GetUserTokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    print(user_tokens)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def UpdateORCreateUserTokens(session_id, access_token, token_type, expires_in, refresh_token):

    Tokens = GetUserTokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if Tokens:
        Tokens.access_token = access_token
        Tokens.refresh_token = refresh_token
        Tokens.expires_in = expires_in
        Tokens.token_type = token_type
        Tokens.save(update_fields=[
            'access_token',
            'refresh_token', 
            'expires_in', 
            'token_type'
        ])
    else:
        Tokens = SpotifyToken(
            user=session_id, 
            access_token=access_token,
            refresh_token=refresh_token, 
            token_type=token_type, 
            expires_in=expires_in
        )
        Tokens.save()
    
def IsSpotifyAuthenticated(session_id):
    Tokens = GetUserTokens(session_id)
    if Tokens:
        expiry = Tokens.expires_in
        if expiry <= timezone.now():
            RefreshSpotifyToken(session_id)
        return True
    return False

def RefreshSpotifyToken(session_id):
    refresh_token = GetUserTokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', 
    data={
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh_token,
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    UpdateORCreateUserTokens(
        session_id, 
        access_token, 
        token_type, 
        expires_in, 
        refresh_token
    )
    
    
