from django.contrib.gis.geos import Point
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from monitor.models import SiteImage, Sites, Assessment, Observations, ObservationPestImage
from django.contrib.gis.measure import D
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from minisass.models import GroupScores


from monitor.serializers import (
	AssessmentSerializer,
	SitesSerializer,
	SitesWithObservationsSerializer,
	SiteImageSerializer,
	ObservationPestImageSerializer
)

class SaveObservationImagesView(generics.CreateAPIView):
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	serializer_class = ObservationPestImageSerializer

	def create(self, request, *args, **kwargs):
		# Extract site ID from the URL
		observation_id = kwargs.get('observationId')

		try:
			observation_id = int(observation_id)
		except ValueError:
			return Response({'error': 'Invalid observation ID'}, status=status.HTTP_400_BAD_REQUEST)

		# Check if the observation exists
		try:
			observation = Observations.objects.get(gid=observation_id)
		except Observations.DoesNotExist:
			return Response({'error': 'observation not found'}, status=status.HTTP_404_NOT_FOUND)

		for key, image in request.FILES.items():
				if 'pest_' in key:
					group_id = key.split(':')[1]
					if group_id:
						group = GroupScores.objects.get(id=group_id)
						pest_image = ObservationPestImage.objects.create(
							observation=observation,
							group=group
						)
						pest_image.image = image
						pest_image.save()


		return Response({'success': 'Images saved successfully'}, status=status.HTTP_201_CREATED)


class SaveSiteImagesView(generics.CreateAPIView):
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	serializer_class = SiteImageSerializer

	def create(self, request, *args, **kwargs):
		# Extract site ID from the URL
		site_id = kwargs.get('site_id')

		try:
			site_id = int(site_id)
		except ValueError:
			return Response({'error': 'Invalid site ID'}, status=status.HTTP_400_BAD_REQUEST)

		# Check if the site exists
		try:
			site = Sites.objects.get(gid=site_id)
		except Site.DoesNotExist:
			return Response({'error': 'Site not found'}, status=status.HTTP_404_NOT_FOUND)

		# Check if the 'images' field is present in the request.FILES
		if 'images' in request.FILES:
		    images = request.FILES.getlist('images', [])
		else:
		    # fallback to using request.FILES directly
		    images = request.FILES.values()

		site_images = []

		for field_name, image in images:
		    try:
		        # Check if the image is a tuple (field name, file)
		        if isinstance(image, tuple):
		            image = image[1]
		
		        site_image = SiteImage(site=site, image=image)
		        site_image.full_clean()  # Validate model fields before saving
		        site_image.save()
		        site_images.append(site_image)
		    except Exception as e:
		        return Response({'error': f'Error saving image: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


		return Response({'success': 'Images saved successfully'}, status=status.HTTP_201_CREATED)



class SitesListCreateView(generics.ListCreateAPIView):
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	queryset = Sites.objects.all()
	serializer_class = SitesSerializer

	def list(self, request):
		queryset = self.get_queryset()
		site_name = request.GET.get('site_name', None)
		if site_name:
			queryset = queryset.filter(site_name__icontains=site_name)

		serializer = SitesSerializer(queryset, many=True)
		return Response(serializer.data)

	def create(self, request, *args, **kwargs):
		# Extract data from the request payload
		site_data = request.data.get('site_data', {})
		images = request.FILES.getlist('images', [])

		# Extract site data
		site_name = site_data.get('site_name', '')
		river_name = site_data.get('river_name', '')
		description = site_data.get('description', '')
		river_cat = site_data.get('river_cat', '')
		longitude = site_data.get('longitude', 0)
		latitude = site_data.get('latitude', 0)

		# Get the user from the request object
		user = request.user

		# Create a new site
		site = Sites.objects.create(
			site_name=site_name,
			river_name=river_name,
			description=description,
			river_cat=river_cat,
			the_geom=Point(x=longitude, y=latitude, srid=4326),
			user=user
		)

		# Save images for the site
		for image in images:
			SiteImage.objects.create(
				site=site, image=image
			)

		# Serialize the created site and return the response
		serializer = self.get_serializer(site)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SiteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Sites.objects.all()
	serializer_class = SitesSerializer


class AssessmentListCreateView(generics.ListCreateAPIView):
	queryset = Assessment.objects.all()
	serializer_class = AssessmentSerializer

class AssessmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Assessment.objects.all()
	serializer_class = AssessmentSerializer


class SiteObservationsByLocation(APIView):
	def get(self, request, latitude, longitude):
		try:
			received_latitude = round(float(latitude), 2)
			received_longitude = round(float(longitude), 2)
			gid = request.GET.get('gid', 0)

			if int(gid) != 0:
				site = Sites.objects.get(gid=gid)
			else:
				site = Sites.objects.filter(
					the_geom__distance_lte=(Point(received_longitude, received_latitude, srid=4326), D(m=5000))
				).first()

			if site:
				serializer = SitesWithObservationsSerializer(site)
				return Response(serializer.data, status=status.HTTP_200_OK)
			else:
				return Response([], status=status.HTTP_404_NOT_FOUND)
		except Sites.DoesNotExist:
			return Response([], status=status.HTTP_404_NOT_FOUND)

