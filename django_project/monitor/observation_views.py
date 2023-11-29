
from monitor.models import Observations, Sites
from minisass_authentication.models import UserProfile
from monitor.serializers import ObservationsSerializer

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext as _

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def create_observations(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body.decode('utf-8'))

            # Extract datainput from the payload
            datainput = data.get('datainput', {})

            # Extract other fields from the payload
            flatworms = data.get('flatworms', False)
            leeches = data.get('leeches', False)
            crabs_shrimps = data.get('crabs_shrimps', False)
            # Add other fields...

            # Extract additional fields from datainput
            score = datainput.get('score', 0)
            site_id = datainput.get('site_id')

            # Get the user from the request object
            user = request.user

            # Create a new Observations instance and save it
            observation = Observations.objects.create(
                score=score,
                site=Sites.objects.get(gid=site_id),
                user=user,
                flatworms=flatworms,
                leeches=leeches,
                crabs_shrimps=crabs_shrimps,
                # Add other fields...
            )

            return JsonResponse({'status': 'success', 'observation_id': observation.id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


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
