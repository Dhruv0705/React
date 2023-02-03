from django.shortcuts import render
from django.http import JsonResponse
from .serializer import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['Is_Host'] = self.request.session.session_key == room[0].Host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({"message": 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({"Bad Request": 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a join key'}, status=status.HTTP_400_BAD_REQUEST)
        
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    
    def post(self, request, format=None):
        from .models import Room
        
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
      
        if serializer.is_valid():
            Guest_Can_Pause = serializer.data.get('Guest_Can_Pause')
            Votes_To_Skip = serializer.data.get('Votes_To_Skip')
            Host = self.request.session.session_key
            queryset = Room.objects.filter(Host=Host)
            if queryset.exists():
                room = queryset[0]
                room.Guest_Can_Pause = Guest_Can_Pause
                room.Votes_To_Skip = Votes_To_Skip
                room.save(update_fields=['Guest_Can_Pause', 'Votes_To_Skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(Host=Host, Guest_Can_Pause=Guest_Can_Pause, Votes_To_Skip=Votes_To_Skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {'code' : self.request.session.get('room_code')}
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):

    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(Host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            Guest_Can_Pause = serializer.data.get('Guest_Can_Pause')
            Votes_To_Skip = serializer.data.get('Votes_To_Skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'MSG' : 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            room = queryset[0]
            user_id = self.request.session.session_key
            if room.Host != user_id:
                return Response({'MSG': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)
            
            room.Guest_Can_Pause = Guest_Can_Pause
            room.Votes_To_Skip = Votes_To_Skip
            room.save(update_fields=['Guest_Can_Pause', 'Votes_To_Skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            
        return Response({'Bad Request' : 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)



