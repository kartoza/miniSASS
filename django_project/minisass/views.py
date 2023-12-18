from rest_framework import generics
from minisass.models import (
    GroupScores,
    Video,
    MobileApp
)
from minisass.serializers import (
    GroupScoresSerializer,
    VideoSerializer,
    MobileAppSerializer
)

class GroupScoresListView(generics.ListAPIView):
    queryset = GroupScores.objects.all()
    serializer_class = GroupScoresSerializer


class VideoListView(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class GetMobileApp(generics.ListAPIView):
    queryset = [MobileApp.objects.filter(active=True).order_by('-id').first()]
    serializer_class = MobileAppSerializer


