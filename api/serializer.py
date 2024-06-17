from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = (
            "id",
            "room_code",
            "host",
            "guest_can_pause",
            "lang",
            "tag",
            "current_station",
            "stations",
            "isPlaying",
            "created_at",
        )

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = (
            "guest_can_pause",
            "lang",
            "tag"
        )

class UpdateRoomSerializer(serializers.ModelSerializer):
    room_code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = (
            "guest_can_pause",
            "lang",
            "tag",
            "room_code"
        )

class ChangeSerializer(serializers.ModelSerializer):
    room_code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = (
            "room_code",
        )