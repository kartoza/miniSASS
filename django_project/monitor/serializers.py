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
    organisationtype = serializers.SerializerMethodField()

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

    def get_organisationtype(self, obj):
        try:
            user_profile = UserProfile.objects.get(user=obj.user)
        except UserProfile.DoesNotExist:
            user_profile = None

        if user_profile:
            organisation_type = user_profile.organisation_type
            serialized_organisation_type = LookupSerializer(organisation_type).data
            return serialized_organisation_type
        else:
            return None

class SitesWithObservationsSerializer(serializers.ModelSerializer):
    observations = ObservationsSerializer(many=True, read_only=True)
    sitename = serializers.CharField(source='site_name')
    rivername = serializers.CharField(source='river_name')
    sitedescription = serializers.CharField(source='description')
    rivercategory = serializers.CharField(source='river_cat')
    longitude = serializers.FloatField(source='the_geom.x')
    latitude = serializers.FloatField(source='the_geom.y')

    class Meta:
        model = Sites
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Combine the site information to the observations
        combined_data = {
            'site': {
                'sitename': data['sitename'],
                'rivername': data['rivername'],
                'rivercategory': data['rivercategory'],
                'sitedescription': data['sitedescription'],
            },
            'observations': [],
        }

        if 'observations' not in data:
            data['observations'] = []

        for observation_data in data['observations']:
            user_profile = UserProfile.objects.filter(user=observation_data['user']).first()
            collectors_name = (
                f"{user_profile.user.first_name} {user_profile.user.last_name}"
                if user_profile and user_profile.user.first_name and user_profile.user.last_name
                else user_profile.user.username if user_profile else ""
            )

            observation_info = {
                'collectorsname': collectors_name,
                'organisationtype': LookupSerializer(user_profile.organisation_type).data if user_profile else None,
                'latitude': data['latitude'],
                'longitude': data['longitude'],
                'obs_date': observation_data['obs_date'],
                'observationImages': [],
            }
            combined_data['observations'].append(observation_info)

        return combined_data
