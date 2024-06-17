from django.urls import path
from .views import *

urlpatterns = [
    path("room", RoomView.as_view()),
    path("create-room", CreateRoomView.as_view()),
    path("get-room", GetRoom.as_view()),
    path("join-room", JoinRoom.as_view()),
    path("user-room", UserInRoom.as_view()),
    path("leave-room", LeaveRoom.as_view()),
    path("update-room", UpdateView.as_view()),
    path("change-station",ChangeStation.as_view()),
    path("get-song",GetSongDetails.as_view()),
    path("toggle-song", TogglePlayPause.as_view()),
    path("", main),
]
