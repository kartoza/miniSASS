from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from monitor.models import Sites
from monitor.serializers import (
    SitesSerializer, 
    SitesWithObservationsSerializer
)
from rest_framework.views import APIView
from django.contrib.gis.geos import Point

class SitesListCreateView(generics.ListCreateAPIView):
    queryset = Sites.objects.all()
    serializer_class = SitesSerializer

class SiteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sites.objects.all()
    serializer_class = SitesSerializer

class SiteObservationsByLocation(APIView):
    def get(self, request, latitude, longitude):
        try:
            # Create a Point object from the latitude and longitude
            site = Sites.objects.get(the_geom__equals=Point(float(longitude), float(latitude), srid=4326))

            serializer = SitesWithObservationsSerializer(site)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Sites.DoesNotExist:
            return Response([], status=status.HTTP_404_NOT_FOUND)
