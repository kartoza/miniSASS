from minisass_authentication.serializers import LookupSerializer
from minisass_authentication.models import UserProfile
from rest_framework import serializers
from monitor.models import (
    Observations,
    Sites
)

class SitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sites
        fields = '__all__'

class ObservationsSerializer(serializers.ModelSerializer):
    site = SitesSerializer()
    sitename = serializers.CharField(source='site.site_name')
    rivername = serializers.CharField(source='site.river_name')
    sitedescription = serializers.CharField(source='site.description')
    rivercategory = serializers.CharField(source='site.river_cat')
    longitude = serializers.FloatField(source='site.the_geom.x')
    latitude = serializers.FloatField(source='site.the_geom.y')
    collectorsname = serializers.SerializerMethodField()
    organisationtype = LookupSerializer(source='user.profile.organisation_type')

    class Meta:
        model = Observations
        fields = '__all__'

    def get_collectorsname(self, obj):
        try:
            user_profile = UserProfile.objects.get(user=obj.user)
        except UserProfile.DoesNotExist:
            user_profile = None

        return (
            f"{user_profile.user.first_name} {user_profile.user.last_name}"
            if user_profile and user_profile.user.first_name and user_profile.user.last_name
            else user_profile.user.username if user_profile else ""
        )
