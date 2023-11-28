
from monitor.models import Observations
from minisass_authentication.models import UserProfile
from monitor.serializers import ObservationsSerializer

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext as _

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


class RecentObservationListView(generics.ListAPIView):
    serializer_class = ObservationsSerializer

    def get_queryset(self):
        return Observations.objects.all().order_by('-time_stamp')[:20]

    def build_recent_observations(self, queryset):
        serialized_data = self.serializer_class(queryset, many=True).data

        recent_observations = []

        for observation in serialized_data:
            try:
                user_profile = UserProfile.objects.get(user=observation['user'])
            except UserProfile.DoesNotExist:
                user_profile = None

            recent_observations.append({
                'observation': observation['gid'],
                'site': observation['site']['site_name'],
                'username': user_profile.user.username if user_profile else "",
                'organisation': user_profile.organisation_name if user_profile else "",
                'time_stamp': observation['time_stamp'],
                'score': observation['score'],
            })

        return recent_observations

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        recent_observations = self.build_recent_observations(queryset)
        return Response(recent_observations)


class ObservationRetrieveView(APIView):
    def get(self, request, *args, **kwargs):
        observation = get_object_or_404(Observations, pk=kwargs['pk'])
        serializer = ObservationsSerializer(observation)
        return Response(serializer.data)



class ObservationListCreateView(generics.ListCreateAPIView):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]

    
class ObservationRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]
