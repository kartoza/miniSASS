
from monitor.models import Observations
from minisass_authentication.models import UserProfile
from monitor.serializers import ObservationsSerializer

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.translation import gettext as _
from django.http import HttpResponse
from decimal import Decimal
import json
from django.http import Http404
from datetime import datetime

class DecimalEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        elif isinstance(o, datetime):
            return o.strftime('%Y-%m-%dT%H:%M:%S')
        return super(DecimalEncoder, self).default(o)

class RecentObservationListView(generics.ListAPIView):
    serializer_class = ObservationsSerializer

    def get_queryset(self):
        return Observations.objects.all().order_by('-time_stamp')[:20]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        recent_observations = []

        for recent_observation in queryset:
            try:
                user_profile = UserProfile.objects.get(user=recent_observation.user)
            except UserProfile.DoesNotExist:
                user_profile = None

            recent_observations.append({
                'observation': recent_observation.gid,
                'site': recent_observation.site.site_name,
                'username': user_profile.user.username if user_profile else "",
                'organisation': user_profile.organisation_name if user_profile else "",
                'time_stamp': recent_observation.time_stamp,
                'score': recent_observation.score,
            })

        json_data = json.dumps(recent_observations, cls=DecimalEncoder)
        return HttpResponse(json_data, content_type='application/json')


class ObservationRetrieveView(generics.RetrieveAPIView):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        observation_id = self.kwargs.get('observation_id', None)
        if observation_id is not None:
            try:
                observation = Observations.objects.get(pk=observation_id)
                try:
                    user_profile = UserProfile.objects.get(user=observation.user)
                except UserProfile.DoesNotExist:
                    user_profile = None
                
                
                observation_data = {
                    'sitename': observation.site.site_name,
                    'rivername': observation.site.river_name,
                    'sitedescription': observation.site.description,
                    'rivercategory': observation.site.river_cat,
                    'longitude': observation.site.the_geom.x,
                    'latitude': observation.site.the_geom.y,
                    'date': observation.obs_date,
                    'collectorsname': user_profile.user.username if user_profile else "",
                    'organisationtype': user_profile.organisation_type if user_profile else "",
                    'average_score': observation.score,
                    'flatworms': observation.flatworms,
                    'worms': observation.worms,
                    'leeches': observation.leeches,
                    'crabs_shrimps': observation.crabs_shrimps,
                    'stoneflies': observation.stoneflies,
                    'minnow_mayflies': observation.minnow_mayflies,
                    'other_mayflies': observation.other_mayflies,
                    'damselflies': observation.damselflies,
                    'dragonflies': observation.dragonflies,
                    'bugs_beetles': observation.bugs_beetles,
                    'caddisflies': observation.caddisflies,
                    'true_flies': observation.true_flies,
                    'snails': observation.snails,
                    'score': observation.score,
                    'water_clarity': observation.water_clarity,
                    'water_temp': observation.water_temp,
                    'ph': observation.ph,
                    'diss_oxygen': observation.diss_oxygen,
                    'diss_oxygen_unit': observation.diss_oxygen_unit,
                    'elec_cond': observation.elec_cond,
                    'elec_cond_unit': observation.elec_cond_unit
                }

                json_data = json.dumps(observation_data, cls=DecimalEncoder)
                return HttpResponse(json_data, content_type='application/json')
                
            except Observations.DoesNotExist:
                raise Http404("Observation not found")

        raise Http404("Observation ID not provided")


class ObservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        site_id = self.kwargs.get('site_id', None)
        
        if site_id is not None:
            return Observations.objects.filter(site_id=site_id)
        else:
            return Observations.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ObservationRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]
