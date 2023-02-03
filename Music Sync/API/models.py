from django.db import models
import string
import random

# Create your models here.
def GenerateUniqueCode():
    Length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=Length))
        if Room.objects.filter(code=code).count() == 0:
            break
    return code

class Room(models.Model):
    code = models.CharField(max_length=8, default=GenerateUniqueCode, unique=True)
    Host = models.CharField(max_length=50, unique=True)
    Guest_Can_Pause = models.BooleanField(null=False, default=False)
    Votes_To_Skip = models.IntegerField(null=False, default=1)
    Created_At = models.DateTimeField(auto_now_add=True)

    