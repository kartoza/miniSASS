from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from monitor.models import Observations
from monitor.serializers import ObservationsSerializer



class ObservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ObservationsSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        site_id = self.kwargs.get('site_id', None)
        recent_only = self.request.query_params.get('recent_only', False)

        if recent_only:
            # If 'recent_only' is specified, return the 20 most recent for main page
            return Observations.objects.all().order_by('-time_stamp')[:20]
        elif site_id is not None:
            # Filter observations by the specified site ID
            return Observations.objects.filter(site_id=site_id)
        else:
            return Observations.objects.all()


class ObservationRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Observations.objects.all()
    serializer_class = ObservationsSerializer
    # permission_classes = [IsAuthenticated]
