from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
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
from django.http import JsonResponse
from pinax.announcements.models import Announcement
from django.utils.timezone import now

class GroupScoresListView(generics.ListAPIView):
    queryset = GroupScores.objects.all().order_by('name')
    serializer_class = GroupScoresSerializer


class VideoListView(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class GetMobileApp(APIView):
    serializer_class = MobileAppSerializer

    def get(self, request):
        mobile_app = MobileApp.objects.filter(active=True).order_by('-id').first()
        return Response(self.serializer_class(mobile_app).data)


def get_announcements(request):
    current_time = now()

    announcements = Announcement.objects.filter(
        publish_start__lte=current_time,
        publish_end__gte=current_time
    ).values('title', 'content', 'dismissal_type')

    return JsonResponse(list(announcements), safe=False)

