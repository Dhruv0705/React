from rest_framework import serializers
from .models import Room
  
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'Host', 'Guest_Can_Pause', 'Votes_To_Skip', 'Created_At')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Room
        fields = ('Guest_Can_Pause', 'Votes_To_Skip')

class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('Guest_Can_Pause', 'Votes_To_Skip', 'code')
