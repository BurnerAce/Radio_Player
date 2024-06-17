from django.db import models
from random import randint


def gen_code():
    len = 6
    num = str(randint(10 ** (len - 1), 10 ** (len) - 1))
    while Room.objects.filter(room_code=num).count() != 0:
        num = str(randint(10 ** (len - 1), 10 ** (len) - 1))
    return "R-" + num


# Create your models here.
class Room(models.Model):
    room_code = models.CharField(
        max_length=8, default=gen_code, unique=True
    )
    host = models.CharField(max_length=8, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    lang = models.CharField(max_length=50,default='english')
    tag = models.CharField(max_length=50,null=True)
    current_station_index = models.IntegerField(default=0)
    current_station = models.CharField(max_length=100,null=True)
    stations = models.TextField(null=True)
    isPlaying = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
