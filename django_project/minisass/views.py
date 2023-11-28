# views.py

from rest_framework import generics
from minisass.models import (
    GroupScores
)
from minisass.serializers import (
    GroupScoresSerializer
)

class GroupScoresListView(generics.ListAPIView):
    queryset = GroupScores.objects.all()
    serializer_class = GroupScoresSerializer
