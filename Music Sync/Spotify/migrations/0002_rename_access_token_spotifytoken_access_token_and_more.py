# Generated by Django 4.1.4 on 2023-02-01 23:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Spotify', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='Access_Token',
            new_name='access_token',
        ),
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='Created_At',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='Expires_IN',
            new_name='expires_In',
        ),
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='Refresh_Token',
            new_name='refresh_token',
        ),
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='Token_Type',
            new_name='token_type',
        ),
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='User',
            new_name='user',
        ),
    ]