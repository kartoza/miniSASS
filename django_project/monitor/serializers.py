from rest_framework import serializers
from monitor.models import (
    Sites
)

class SitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sites
        fields = '__all__'
