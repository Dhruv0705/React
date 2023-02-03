from django.urls import path
from .views import AuthURL, SpotifyCallback, IsAuthenticated

app_name = 'Spotify'

urlpatterns = [
    path ('get-auth-url', AuthURL.as_view()),
    path ('redirect', SpotifyCallback),
    path ('is-authenticated', IsAuthenticated.as_view())
]
