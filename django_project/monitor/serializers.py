from rest_framework import serializers
from monitor.models import Observations

class ObservationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observations
        fields = '__all__'
