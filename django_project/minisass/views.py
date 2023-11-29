from rest_framework import generics
from minisass.models import (
    GroupScores,
    Video
)
from minisass.serializers import (
    GroupScoresSerializer,
    VideoSerializer
)

class GroupScoresListView(generics.ListAPIView):
    queryset = GroupScores.objects.all()
    serializer_class = GroupScoresSerializer

class VideoListView(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

