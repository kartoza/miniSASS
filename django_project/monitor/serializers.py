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
    site = serializers.SerializerMethodField()
    collectorsname = serializers.SerializerMethodField()
    organisationtype = serializers.SerializerMethodField()

    class Meta:
        model = Observations
        fields = '__all__'

    def get_site(self, obj):
        return {
            'sitename': obj.site.site_name,
            'rivername': obj.site.river_name,
            'sitedescription': obj.site.description,
            'rivercategory': obj.site.river_cat,
            'longitude': obj.site.the_geom.x,
            'latitude': obj.site.the_geom.y,
        }

    def get_collectorsname(self, obj):
        user_profile = self.get_user_profile(obj)
        return (
            f"{user_profile.user.first_name} {user_profile.user.last_name}"
            if user_profile and user_profile.user.first_name and user_profile.user.last_name
            else user_profile.user.username if user_profile else ""
        )

    def get_organisationtype(self, obj):
        user_profile = self.get_user_profile(obj)
        return LookupSerializer(user_profile.organisation_type).data if user_profile else ""

    def get_user_profile(self, obj):
        try:
            return UserProfile.objects.get(user=obj.user)
        except UserProfile.DoesNotExist:
            return None
