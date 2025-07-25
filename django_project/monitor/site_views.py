import json
from decimal import Decimal
from django.contrib.gis.geos import Point
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from monitor.models import (
	SiteImage,
	Sites,
	Assessment,
	Observations,
	ObservationPestImage
)
from django.contrib.gis.measure import D
from rest_framework.parsers import (
	MultiPartParser,
	FormParser,
	JSONParser
)
from minisass.models import GroupScores
from django.utils.dateparse import parse_date
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny


from monitor.serializers import (
	AssessmentSerializer,
	SitesSerializer,
	SitesWithObservationsSerializer,
	SiteImageSerializer,
	ObservationPestImageSerializer,
	SitesAndObservationsSerializer
)

class SaveObservationImagesView(generics.CreateAPIView):
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	serializer_class = ObservationPestImageSerializer

	def create(self, request, *args, **kwargs):
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
		site_id = kwargs.get('site_id')
		try:
			site_id = int(site_id)
		except ValueError:
			return Response({'error': 'Invalid site ID'}, status=status.HTTP_400_BAD_REQUEST)

		# Check if the site exists
		try:
			site = Sites.objects.get(gid=site_id)
		except Sites.DoesNotExist:
			return Response({'error': 'Site not found'}, status=status.HTTP_404_NOT_FOUND)

		# Check if the 'images' field is present in the request.FILES
		if 'images' in request.FILES:
			images = request.FILES.getlist('images', [])
		else:
			# fallback to using request.FILES directly
			images = request.FILES.values()

		site_images = []

		for image in images:
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


class SitesPagination(PageNumberPagination):
	page_size = 20
	page_size_query_param = 'page_size'
	max_page_size = 100


class SitesListCreateView(generics.ListCreateAPIView):
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	queryset = Sites.objects.all()
	serializer_class = SitesSerializer
	authentication_classes = [JWTAuthentication]
	pagination_class = SitesPagination

	def get_permissions(self):
		if self.request.method == 'POST':
			return [IsAuthenticated()]
		return [AllowAny()]

	def list(self, request):
		queryset = self.get_queryset()
		site_name = request.GET.get('site_name', None)
		if site_name:
			queryset = queryset.filter(site_name__icontains=site_name)

		my_sites = request.GET.get('my_sites', '').lower() == 'true'
		if my_sites and request.user.is_authenticated:
			queryset = queryset.filter(user_id=request.user.id)

		# Check if pagination is requested
		paginated = request.GET.get('paginated', '').lower() == 'true'

		if paginated:
			# Use DRF's built-in pagination
			page = self.paginate_queryset(queryset)
			if page is not None:
				serializer = self.get_serializer(page, many=True)
				return self.get_paginated_response(serializer.data)

		serializer = SitesSerializer(queryset, many=True)
		return Response(serializer.data)

	def create(self, request, *args, **kwargs):
		highest_gid = Sites.objects.latest('gid').gid if Sites.objects.exists() else 0
		new_gid = highest_gid + 1

		# Extract data from the request payload
		site_data = request.data.get('site_data', {})
		if isinstance(site_data, str):
			site_data = json.loads(site_data)

		# Extract site data
		site_name = site_data.get('site_name', '')
		river_name = site_data.get('river_name', '')
		description = site_data.get('description', '')
		river_cat = site_data.get('river_cat', '')
		longitude = float(site_data.get('longitude', 0))
		latitude = float(site_data.get('latitude', 0))

		# Get the user from the request object
		user = request.user

		# Create a new site
		site = Sites(
			gid=new_gid,
			site_name=site_name,
			river_name=river_name,
			description=description,
			river_cat=river_cat,
			the_geom=Point(x=longitude, y=latitude, srid=4326),
			user=user
		)
		try:
			site.save()
		except ValueError as e:
			return Response(
				{'status': 'error', 'message': str(e)},
				status=status.HTTP_400_BAD_REQUEST
			)

		# Save images for the site
		for key, image in request.FILES.items():
			if key.startswith('images'):
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
	authentication_classes = [JWTAuthentication]

	def get_permissions(self):
		if self.request.method in ['POST', 'PUT', 'PATCH']:
			return [IsAuthenticated()]
		return [AllowAny()]

	def update(self, request, *args, **kwargs):
		request.data['user'] = request.user.pk
		return super().update(request, *args, **kwargs)


class AssessmentListCreateView(generics.ListCreateAPIView):
	queryset = Assessment.objects.all()
	serializer_class = AssessmentSerializer

class AssessmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Assessment.objects.all()
	serializer_class = AssessmentSerializer


class SiteObservationsByLocation(APIView):
	def get(self, request, latitude, longitude):
		try:
			received_latitude = float(latitude)
			received_longitude = float(longitude)
			gid = request.GET.get('gid', 0)

			if int(gid) != 0:
				site = Sites.objects.get(gid=gid)
			else:
				site = Sites.objects.filter(
					the_geom__distance_lte=(Point(received_longitude, received_latitude, srid=4326), D(m=100))
				).first()

			if site:
				serializer = SitesWithObservationsSerializer(site)
				return Response(serializer.data, status=status.HTTP_200_OK)
			else:
				return Response([], status=status.HTTP_404_NOT_FOUND)
		except Sites.DoesNotExist:
			return Response([], status=status.HTTP_404_NOT_FOUND)
		

class SitesWithObservationsView(APIView):
	serializer_class = SitesAndObservationsSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]
	@swagger_auto_schema(
		operation_description="Retrieve detailed information about a site, including its observations and images.",
		manual_parameters=[
			openapi.Parameter(
				'start_date', 
				openapi.IN_QUERY, 
				description="Start date in YYYY-MM-DD format", 
				type=openapi.TYPE_STRING
			)
		],
		responses={
			200: openapi.Response(
				description="Successful response",
				examples={
					"application/json": {
						"site": {
							"gid": 1,
							"sitename": "Sample Site",
							"rivername": "Sample River",
							"rivercategory": "rocky",
							"sitedescription": "This is a description of the sample site.",
							"images": [
								{
									"id": 1,
									"image": "https://minisass.org/path/to/image.jpg"
								},
								{
									"id": 2,
									"image": "https://example.com/path/to/another-image.jpg"
								}
							],
							"observations": [
								{
									"obs_id": 123,
									"obs_date": "2024-08-21",
									"ml_score": "5.0",
									"collector_name": "John Doe",
									"score": 3.45,
									"comment": "Observation comment",
									"is_validated": True,
									"water_clarity": 2.5,
									"water_temp": 20.3,
									"ph": 7.2,
									"diss_oxygen": 8.5,
									"diss_oxygen_unit": "mgl",
									"elec_cond": 0.5,
									"elec_cond_unit": "mS/m",
									"images": [
										{
											"id": 1,
											"image": "https://example.com/path/to/obs-image.jpg",
											"description": "Observation image description"
										}
									]
								}
							]
						}
					}
				}
			),
			400: openapi.Response(description="Invalid date format"),
		},
		tags=['Sites with Observations']
	)
	def get(self, request):
		start_date_str = request.query_params.get('start_date', None)
		start_date = parse_date(start_date_str) if start_date_str else None

		if start_date_str and not start_date:
			return Response({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

		if start_date:
			observations = Observations.objects.filter(obs_date__gte=start_date)
			site_ids = observations.values_list('site_id', flat=True).distinct()
			sites = Sites.objects.filter(gid__in=site_ids)
		else:
			sites = Sites.objects.all()

		serializer = self.serializer_class(sites, many=True, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)
