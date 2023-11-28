# views.py

from rest_framework import generics
from minisass.models import Video
from minisass.serializers import VideoSerializer

class VideoListView(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
