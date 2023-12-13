from django.contrib.gis.geos import Point
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from monitor.models import SiteImage, Sites, Assessment
from django.contrib.gis.measure import D


from monitor.serializers import (
    AssessmentSerializer,
    SitesSerializer,
    SitesWithObservationsSerializer
)


class SitesListCreateView(generics.ListCreateAPIView):
    queryset = Sites.objects.all()
    serializer_class = SitesSerializer

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
            # Create a Point object from the latitude and longitude
            point = Point(float(longitude), float(latitude), srid=4326)

            # Define a range for latitude and longitude (adjust the values as needed)
            latitude_range = (point.y - 5, point.y + 5)
            longitude_range = (point.x - 5, point.x + 5)

            # Retrieve the first site within the specified range
            site = Sites.objects.filter(
                the_geom__within=(Point(longitude_range[0], latitude_range[0], srid=4326),
                                  Point(longitude_range[1], latitude_range[1], srid=4326))
            ).first()

            if site:
                serializer = SitesWithObservationsSerializer(site)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response([], status=status.HTTP_404_NOT_FOUND)
        except Sites.DoesNotExist:
            return Response([], status=status.HTTP_404_NOT_FOUND)

