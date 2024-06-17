from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from .models import Room
from .serializer import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from requests import get


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(room_code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {"BadRequest": "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"BadRequest": "Invalid session"}, status=status.HTTP_400_BAD_REQUEST
        )


class JoinRoom(APIView):
    lookup_url_kwarg = "code"

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        room_code = request.data.get(self.lookup_url_kwarg)
        if room_code != None:
            room = Room.objects.filter(room_code=room_code)
            if len(room) > 0:
                room = room[0]
                self.request.session["code"] = room_code
                self.request.session["url"] = room.stations.split(" ")[
                    room.current_station_index
                ]
                self.request.session["isPlaying"] = room.isPlaying
                return Response({"message": "Room Joined"}, status=status.HTTP_200_OK)
            return Response(
                {"Bad Request": "No such Room exists"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"Bad Request": "Invalid  post data, can't find room code key"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if "code" in self.request.session:
            self.request.session.pop("code")
            self.request.session.pop("url")
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
                return Response({"message": "Success"}, status=status.HTTP_200_OK)
            return Response(
                {"Bad Request": "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND
            )


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            guest_can_pause = serializer.data.get("guest_can_pause")
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.isPlaying = True
                if (
                    serializer.data.get("lang") == room.lang
                    and serializer.data.get("tag") == room.tag
                ):
                    room.save(update_fields=["guest_can_pause", "isPlaying"])
                else:
                    room.stations = get_stations(
                        serializer.data.get("lang"), serializer.data.get("tag")
                    )
                    room.lang = serializer.data.get("lang")
                    room.tag = serializer.data.get("tag")
                    room.current_station_index = 0
                    room.current_station = room.stations.split(" ", 1)[0]

                    room.save(
                        update_fields=[
                            "guest_can_pause",
                            "stations",
                            "lang",
                            "tag",
                            "current_station",
                            "current_station_index",
                            "isPlaying",
                        ]
                    )
            else:
                stations = get_stations(
                    serializer.data.get("lang"), serializer.data.get("tag")
                )
                lang = serializer.data.get("lang")
                tag = serializer.data.get("tag")
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    stations=stations,
                    lang=lang,
                    tag=tag,
                    current_station=stations.split(" ", 1)[0],
                    current_station_index=0,
                )
                room.save()
            self.request.session["code"] = room.room_code
            self.request.session["url"] = room.current_station
            self.request.session["isPlaying"] = room.isPlaying
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response(
            {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        room = Room.objects.filter(room_code=self.request.session.get("code"))
        data = {"code": None}
        if room.exists():
            room = room[0]
            data = {
                "code": room.room_code,
            }

        return JsonResponse(data, status=status.HTTP_200_OK)


class GetSongDetails(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        room = Room.objects.filter(room_code=self.request.session.get("code"))
        data = {"url": None, "playing": True, "index": -1}
        if room.exists():
            room = room[0]
            data["url"] = room.current_station
            data["playing"] = room.isPlaying
            data["index"] = room.current_station_index

        return JsonResponse(data, status=status.HTTP_200_OK)


class TogglePlayPause(APIView):
    serializer_class = ChangeSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room_code = serializer.data.get("room_code")

            queryset = Room.objects.filter(room_code=room_code)
            if not queryset.exists():
                return Response(
                    {"Bad Request": "Invalid Room Code"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            room = queryset[0]

            user_id = self.request.session.session_key
            data = {"playing": True}
            if room.host == user_id or room.guest_can_pause:
                room.isPlaying = not room.isPlaying
                data["playing"] = room.isPlaying
                room.save(update_fields=["isPlaying"])

            return Response(data, status=status.HTTP_200_OK)
        return Response(
            {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class UpdateView(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, fomat=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room_code = serializer.data.get("room_code")

            queryset = Room.objects.filter(room_code=room_code)
            if not queryset.exists():
                return Response(
                    {"Bad Request": "Invalid Room Code"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            room = queryset[0]

            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response(
                    {"Bad Request": "You are not the host of this room"},
                    status=status.HTTP_403_FORBIDDEN,
                )
            room.isPlaying = True
            room.guest_can_pause = serializer.data.get("guest_can_pause")
            if (
                serializer.data.get("lang") == room.lang
                and serializer.data.get("tag") == room.tag
            ):
                room.save(update_fields=["guest_can_pause", "isPlaying"])
            else:
                room.stations = get_stations(
                    serializer.data.get("lang"), serializer.data.get("tag")
                )
                room.lang = serializer.data.get("lang")
                room.tag = serializer.data.get("tag")
                room.current_station = room.stations.split(" ", 1)[0]
                room.current_station_index = 0
                room.save(
                    update_fields=[
                        "guest_can_pause",
                        "stations",
                        "lang",
                        "tag",
                        "current_station",
                        "current_station_index",
                        "isPlaying",
                    ]
                )

            self.request.session["url"] = room.current_station
            return Response(
                {"url": self.request.session["url"]}, status=status.HTTP_200_OK
            )

        return Response(
            {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class ChangeStation(APIView):
    serializer_class = ChangeSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room_code = serializer.data.get("room_code")
            room = Room.objects.filter(room_code=room_code)
            if room.exists():
                room = room[0]
                stations = room.stations.split(" ")
                room.current_station_index = room.current_station_index + 1
                if room.current_station_index == len(stations):
                    stations = get_stations(room.lang, room.tag)
                    room.current_station_index = 0
                    room.current_station = stations.split(" ", 1)[0]
                else:
                    room.current_station = stations[room.current_station_index]
                room.station = stations
                room.isPlaying = True
                room.save(
                    update_fields=[
                        "current_station",
                        "current_station_index",
                        "stations",
                        "isPlaying",
                    ]
                )

                self.request.session["url"] = room.current_station
                self.request.session["isPlaying"] = room.isPlaying

                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            return Response(
                {"Bad Request": "NO such room"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


def get_stations(lang="english", tag=None):
    response = get("https://de1.api.radio-browser.info/json/stations/bycountry/India")
    if response.ok:
        response = response.json()
        res = []
        for radio_station in response:
            lang_take = False
            tag_take = False
            if lang == radio_station["language"].lower():
                lang_take = True
            if tag is None or tag in radio_station["tags"]:
                tag_take = True

            if tag_take and lang_take:
                res.append(radio_station["url"])

        return " ".join(res)
    return ""


def main(request):
    return HttpResponse("<h1>Hello</h1>")
