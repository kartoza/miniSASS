from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from monitor.models import Sites
from monitor.serializers import (
    SitesSerializer,
    AssessmentSerializer
)

class SitesListCreateView(generics.ListCreateAPIView):
    queryset = Sites.objects.all()
    serializer_class = SitesSerializer

class SiteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sites.objects.all()
    serializer_class = SitesSerializer

class AssessmentListCreateView(generics.ListCreateAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class AssessmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
