import json
from decimal import Decimal

from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import Point
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext as _
from django.db.models import Max
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from django.http import Http404
from datetime import datetime

from minisass_authentication.models import UserProfile

from monitor.models import (
    Observations, Sites, SiteImage, ObservationPestImage, Pest
)
from monitor.serializers import (
    ObservationsSerializer, 
    ObservationPestImageSerializer, 
    ObservationsAllFieldsSerializer
)
from django.core.exceptions import ValidationError
from django.db import transaction

def get_observations_by_site(request, site_id, format=None):
    try:
        site = Sites.objects.get(gid=site_id)
        observations = Observations.objects.filter(site=site)
        serializer = ObservationsAllFieldsSerializer(observations, many=True)
        
        return JsonResponse(
            {'status': 'success', 'observations': serializer.data}
        )
    except Sites.DoesNotExist:
        raise Http404("Site does not exist")



@csrf_exempt
@login_required
def upload_pest_image(request):
    """
    This view function handles the upload of pest images, associating them with an observation and a site.
    
    - Creates an empty site and observation.
    - Associates uploaded images with the observation.
    - Returns the observation ID, site ID, and image IDs for further processing.

    Note:
    - The function saves user uploads before saving the observation to facilitate AI calculations on the images.
    - The returned image IDs can be used for image deletion if the user decides to change their selection.

    Expected Data:
    - 'datainput' object: Contains additional information about the observation.
    - 'observationID': Specifies the ID for the observation.
    - Uploaded files: Images to be associated with the observation.

    :param request: The HTTP request object.
    :return: JsonResponse with status, observation ID, site ID, and pest image IDs.
    """
    if request.method == 'POST':
        try:
            with transaction.atomic():
                
                site_id = request.POST.get('siteId')
                observation_id = request.POST.get('observationId')
                user = request.user
                try:
                    site_id = int(site_id)
                    observation_id = int(observation_id)
                except (ValueError, TypeError):
                    site_id = 0
                    observation_id = 0


                try:
                    site = Sites.objects.get(gid=site_id)  
                    
                except Sites.DoesNotExist:
                    max_site_id = Sites.objects.all().aggregate(Max('gid'))['gid__max']
                    new_site_id = max_site_id + 1 if max_site_id is not None else 1
    
                    site = Sites.objects.create(
                        gid=new_site_id,
                        the_geom=Point(x=0, y=0, srid=4326),
                        user=user
                    )

                try:
                    observation = Observations.objects.get(gid=observation_id, site=site)
                except Observations.DoesNotExist:
                    max_observation_id = Observations.objects.all().aggregate(Max('gid'))['gid__max']
                    new_observation_id = max_observation_id + 1 if max_observation_id is not None else 1

                    observation = Observations.objects.create(
                        gid=new_observation_id,
                        site=site,
                        user=user,
                        comment='',
                        obs_date=datetime.now()
                    )

                # Save images in the request object
                for key, image in request.FILES.items():
                    if 'pest_' in key:
                        pest_name = key.split(':')[1]
                        if pest_name:
                            pest, _ = Pest.objects.get_or_create(
                                name=pest_name.replace('_', ' ').capitalize()
                            )
                            pest_image, _ = ObservationPestImage.objects.get_or_create(
                                observation=observation,
                                pest=pest
                            )
                            pest_image.image = image
                            pest_image.save()

                return JsonResponse(
                    {
                        'status': 'success', 
                        'observation_id': observation.gid,
                        'site_id': site.gid,
                        'pest_image_id': pest_image.id
                    }
                )
        except ValidationError as ve:
            # Handle validation errors (e.g., invalid data)
            return JsonResponse({'status': 'error', 'message': str(ve)})
        except Exception as e:
            # Handle other exceptions
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@csrf_exempt
@login_required
def delete_pest_image(request, observation_pk, pk, **kwargs):
    if request.method == 'POST':
        try:
            # Check if observation_pk and pk are not empty, if empty, use values from kwargs
            observation_id = observation_pk if observation_pk else kwargs.get('observation_pk')
            image_id = pk if pk else kwargs.get('pk')

            if not observation_id or not image_id:
                return JsonResponse({'status': 'error', 'message': 'Observation_pk and pk must be provided.'}, status=400)


            observation = get_object_or_404(Observations, gid=observation_id)

            image = get_object_or_404(ObservationPestImage, id=image_id, observation=observation)

            image.delete()

            return JsonResponse({'status': 'success', 'message': 'Image deleted successfully.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


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
            flatworms = data.get('Flat Worms', False)
            worms = data.get('Worms', False)
            leeches = data.get('Leeches', False)
            crabs_shrimps = data.get('Crabs or Shrimps', False)
            stoneflies = data.get('Stoneflies', False)
            minnow_mayflies = data.get('Minnow Mayflies', False)
            other_mayflies = data.get('Other Mayflies', False)
            damselflies = data.get('Damselflies', False)
            dragonflies = data.get('Dragonflies', False)
            bugs_beetles = data.get('Bugs or Beetles', False)
            caddisflies = data.get('Caddisflies', False)
            true_flies = data.get('True Flies', False)
            snails = data.get('Snails', False)
            score = Decimal(str(data.get('score', 0)))
            comment = datainput.get('notes', '')
            water_clarity = Decimal(str(datainput.get('waterclaritycm', 0)))
            water_temp = Decimal(str(datainput.get('watertemperatureOne', 0)))
            ph = Decimal(str(datainput.get('ph', 0)))
            diss_oxygen = Decimal(str(datainput.get('dissolvedoxygenOne', 0)))
            diss_oxygen_unit = datainput.get('dissolvedoxygenOneUnit', 'mgl')
            elec_cond = Decimal(str(datainput.get('electricalconduOne', 0)))
            elec_cond_unit = datainput.get('electricalconduOneUnit', 'mS/m')
            site_id = request.POST.get('siteId',datainput.get('selectedSite', 0))
            observation_id = request.POST.get('observationId')
            obs_date = datainput.get('date')
            user = request.user
            try:
                site_id = int(site_id)
                observation_id = int(observation_id)
            except (ValueError, TypeError):
                site_id = 0
                observation_id = 0

            create_site_or_observation = request.POST.get('create_site_or_observation', 'True')

            if create_site_or_observation.lower() == 'true':
                try:
                    site = Sites.objects.get(gid=site_id)
                except Sites.DoesNotExist:
                    max_site_id = Sites.objects.all().aggregate(Max('gid'))['gid__max']
                    new_site_id = max_site_id + 1 if max_site_id is not None else 1

                    site_name = datainput.get('siteName', '')
                    river_name = datainput.get('riverName', '')
                    description = datainput.get('siteDescription', '')
                    river_cat = datainput.get('rivercategory', 'rocky')

                    # Make lng lat max 6 decimal place
                    longitude = float("{:.6f}".format(float(datainput.get('longitude', 0))))
                    latitude = float("{:.6f}".format(float(datainput.get('latitude', 0))))

                    if Sites.objects.filter(site_name=site_name).exists():
                        return JsonResponse({'status': 'error', 'message': 'Site name already exists'})

                    site = Sites.objects.create(
                        gid=new_site_id,
                        site_name=site_name,
                        river_name=river_name,
                        description=description,
                        river_cat=river_cat,
                        the_geom=Point(x=longitude, y=latitude, srid=4326),
                        user=user
                    )

                for key, image in request.FILES.items():
                    if 'image_' in key:
                        SiteImage.objects.create(
                            site=site, image=image
                        )

                max_observation_id = Observations.objects.all().aggregate(Max('gid'))['gid__max']
                new_observation_id = max_observation_id + 1 if max_observation_id is not None else 1
                observation = Observations.objects.create(
                    gid=new_observation_id,
                    score=score,
                    site=site,
                    user=user,
                    flatworms=flatworms,
                    worms=worms,
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

            elif create_site_or_observation.lower() == 'false':
                try:
                    site = Sites.objects.get(gid=site_id)
                    
                    site_name = datainput.get('siteName', '')
                    river_name = datainput.get('riverName', '')
                    description = datainput.get('siteDescription', '')
                    river_cat = datainput.get('rivercategory', 'rocky')
                    longitude = datainput.get('longitude', 0)
                    latitude = datainput.get('latitude', 0)

                    site.site_name = site_name
                    site.river_name = river_name
                    site.description = description
                    site.river_cat = river_cat
                    site.the_geom = Point(x=longitude, y=latitude, srid=4326)
                    site.user = user
                    site.save()

                    for key, image in request.FILES.items():
                        if 'image_' in key:
                            SiteImage.objects.create(
                                site=site, image=image
                            )

                except Sites.DoesNotExist:
                    pass


                try:
                    observation = Observations.objects.get(gid=observation_id)

                    observation.score = score
                    observation.site = site
                    observation.user = user
                    observation.flatworms = flatworms
                    observation.worms = worms
                    observation.leeches = leeches
                    observation.crabs_shrimps = crabs_shrimps
                    observation.stoneflies = stoneflies
                    observation.minnow_mayflies = minnow_mayflies
                    observation.other_mayflies = other_mayflies
                    observation.damselflies = damselflies
                    observation.dragonflies = dragonflies
                    observation.bugs_beetles = bugs_beetles
                    observation.caddisflies = caddisflies
                    observation.true_flies = true_flies
                    observation.snails = snails
                    observation.comment = comment
                    observation.water_clarity = water_clarity
                    observation.water_temp = water_temp
                    observation.ph = ph
                    observation.diss_oxygen = diss_oxygen
                    observation.diss_oxygen_unit = diss_oxygen_unit
                    observation.elec_cond = elec_cond
                    observation.elec_cond_unit = elec_cond_unit
                    observation.obs_date = obs_date

                    observation.save()

                except Observations.DoesNotExist:
                    pass

            return JsonResponse(
                {'status': 'success', 'observation_id': observation.gid})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse(
        {'status': 'error', 'message': 'Invalid request method'})


class RecentObservationListView(generics.ListAPIView):
    serializer_class = ObservationsSerializer

    def get_queryset(self, site_id=None, recent=True, by_user=False, user=None):
        all_obs = Observations.objects.all().order_by('-time_stamp')
        if site_id:
            all_obs = all_obs.filter(site_id=site_id)
        if by_user and user.id:
            all_obs = all_obs.filter(user=user)
        return all_obs[:20] if recent else all_obs

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
                'obs_date': observation['obs_date'],
                'score': observation['score'],
            })

        return recent_observations

    def get(self, request, *args, **kwargs):
        site_id = request.GET.get('site_id', None)
        by_user = request.GET.get('by_user', 'False')
        by_user = by_user in ['True', 'true', '1', 'yes']
        recent = request.GET.get('recent', 'True')
        recent = recent in ['True', 'true', '1', 'yes'] and not request.user.id
        queryset = self.get_queryset(site_id, recent, by_user, request.user)
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
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    permission_classes = [IsAuthenticated]
