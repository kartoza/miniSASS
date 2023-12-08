import json
from decimal import Decimal

from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import Point
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from minisass_authentication.models import UserProfile
from monitor.models import (
    Observations, Sites, SiteImage, ObservationPestImage, Pest
)
from monitor.serializers import (
    ObservationsSerializer, ObservationPestImageSerializer
)


@csrf_exempt
@login_required
def create_observations(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.POST.get('data', '{}'))

            # Extract datainput from the payload
            datainput = data.get('datainput', {})

            # Extract other fields from the payload
            flatworms = data.get('flatworms', False)
            leeches = data.get('leeches', False)
            crabs_shrimps = data.get('crabs_shrimps', False)
            stoneflies = data.get('stoneflies', False)
            minnow_mayflies = data.get('minnow_mayflies', False)
            other_mayflies = data.get('other_mayflies', False)
            damselflies = data.get('damselflies', False)
            dragonflies = data.get('dragonflies', False)
            bugs_beetles = data.get('bugs_beetles', False)
            caddisflies = data.get('caddisflies', False)
            true_flies = data.get('true_flies', False)
            snails = data.get('snails', False)
            score = Decimal(str(datainput.get('score', 0)))
            comment = datainput.get('notes', '')
            water_clarity = Decimal(str(datainput.get('waterclaritycm', 0)))
            water_temp = Decimal(str(datainput.get('watertemperatureOne', 0)))
            ph = Decimal(str(datainput.get('ph', 0)))
            diss_oxygen = Decimal(str(datainput.get('dissolvedoxygenOne', 0)))
            diss_oxygen_unit = datainput.get('dissolvedoxygenOneUnit', 'mgl')
            elec_cond = Decimal(str(datainput.get('electricalconduOne', 0)))
            elec_cond_unit = datainput.get('electricalconduOneUnit', 'mS/m')
            site_id = datainput.get('selectedSite')
            try:
                site_id = int(site_id)
            except (ValueError, TypeError):
                site_id = 0
            obs_date = datainput.get('date')

            # Get the user from the request object
            user = request.user

            # Check if the site with the given site_id exists
            try:
                site = Sites.objects.get(gid=site_id)
            except Sites.DoesNotExist:
                # If it doesn't exist, create a new site
                site_name = datainput.get('siteName', '')
                river_name = datainput.get('riverName', '')
                description = datainput.get('siteDescription', '')
                river_cat = datainput.get('rivercategory', '')
                longitude = datainput.get('longitude', 0)
                latitude = datainput.get('latitude', 0)

                # Save the new site
                site = Sites.objects.create(
                    site_name=site_name,
                    river_name=river_name,
                    description=description,
                    river_cat=river_cat,
                    the_geom=Point(x=longitude, y=latitude, srid=4326),
                    user=user
                )

            # Save images
            for key, image in request.FILES.items():
                if 'image_' in key:
                    SiteImage.objects.create(
                        site=site, image=image
                    )

            # Create a new Observations instance and save it
            observation = Observations.objects.create(
                score=score,
                site=site,
                user=user,
                flatworms=flatworms,
                leeches=leeches,
                crabs_shrimps=crabs_shrimps,
                stoneflies=stoneflies,
                minnow_mayflies=minnow_mayflies,
                other_mayflies=other_mayflies,
                damselflies=damselflies,
                dragonflies=dragonflies,
                bugs_beetles=bugs_beetles,
                caddisflies=caddisflies,
                true_flies=true_flies,
                snails=snails,
                comment=comment,
                water_clarity=water_clarity,
                water_temp=water_temp,
                ph=ph,
                diss_oxygen=diss_oxygen,
                diss_oxygen_unit=diss_oxygen_unit,
                elec_cond=elec_cond,
                elec_cond_unit=elec_cond_unit,
                obs_date=obs_date
            )

            # Save images
            for key, image in request.FILES.items():
                if 'pest_' in key:
                    pest = key.split(':')[1]
                    if pest:
                        pest, _ = Pest.objects.get_or_create(
                            name=pest.replace('_', ' ').capitalize()
                        )
                        pest_image, _ = ObservationPestImage.objects.get_or_create(
                            observation=observation,
                            pest=pest
                        )
                        pest_image.image = image
                        pest_image.save()

            return JsonResponse(
                {'status': 'success', 'observation_id': observation.gid})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse(
        {'status': 'error', 'message': 'Invalid request method'})


class RecentObservationListView(generics.ListAPIView):
    serializer_class = ObservationsSerializer

    def get_queryset(self):
        return Observations.objects.all().order_by('-time_stamp')[:20]

    def build_recent_observations(self, queryset):
        serialized_data = self.serializer_class(queryset, many=True).data

        recent_observations = []

        for observation in serialized_data:
            try:
                user_profile = UserProfile.objects.get(
                    user=observation['user'])
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


class ObservationImageViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """Return images of observation"""
    serializer_class = ObservationPestImageSerializer

    def get_queryset(self):
        """Return queryset."""
        observation = get_object_or_404(
            Observations, pk=self.kwargs['observation_pk']
        )
        return observation.observationpestimage_set.all()

    def destroy(self, request, *args, **kwargs):
        # TODO:
        #  Update who can delete an image
        observation = get_object_or_404(
            Observations, pk=self.kwargs['observation_pk']
        )
        if not request.user.is_authenticated or (
                not request.user.is_staff and request.user != observation.user
        ):
            raise PermissionDenied()
        return super().destroy(request, *args, **kwargs)


class ObservationListCreateView(generics.ListCreateAPIView):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]


class ObservationRetrieveUpdateDeleteView(
    generics.RetrieveUpdateDestroyAPIView):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]
