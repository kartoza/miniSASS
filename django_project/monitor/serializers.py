from rest_framework import serializers

from minisass_authentication.models import UserProfile
from minisass_authentication.serializers import LookupSerializer
from monitor.models import (
	Observations,
	ObservationPestImage,
	Sites,
	SiteImage,
	Assessment
)


class ObservationsAllFieldsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Observations
		fields = '__all__'


class AssessmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Assessment
		fields = '__all__'


class SiteImageSerializer(serializers.ModelSerializer):
	"""Serializer of site images."""

	class Meta:
		model = SiteImage
		exclude = ('site',)


class SitesSerializer(serializers.ModelSerializer):
	"""Serializer of site."""

	images = serializers.SerializerMethodField()

	def get_images(self, obj):
		"""Return images of site."""
		return SiteImageSerializer(
			obj.siteimage_set.all(), many=True
		).data

	def to_representation(self, instance):
		representation = super().to_representation(instance)

		# Fetch the latest observation for the current site
		latest_observation = instance.observation.order_by('-obs_date').first()

		if latest_observation:
			representation['score'] = latest_observation.score

		return representation

	class Meta:
		model = Sites
		fields = '__all__'


class ObservationPestImageSerializer(serializers.ModelSerializer):
	"""Serializer for Observation Pert image."""

	pest_id = serializers.SerializerMethodField()
	pest_name = serializers.SerializerMethodField()

	ml_score = serializers.FloatField()
	ml_prediction = serializers.CharField()

	def get_pest_id(self, instance):
		if instance.group:
			return instance.group_id
		elif instance.pest:
			return instance.pest_id
		return None

	def get_pest_name(self, instance):
		if instance.group:
			return instance.group.name
		elif instance.pest:
			return instance.pest.name
		return None

	class Meta:
		model = ObservationPestImage
		exclude = ('observation', 'pest')


class ObservationsSerializer(serializers.ModelSerializer):
	"""Serializer of observation."""

	site = SitesSerializer()
	sitename = serializers.CharField(source='site.site_name')
	rivername = serializers.CharField(source='site.river_name')
	sitedescription = serializers.CharField(source='site.description')
	rivercategory = serializers.CharField(source='site.river_cat')
	longitude = serializers.FloatField(source='site.the_geom.x')
	latitude = serializers.FloatField(source='site.the_geom.y')
	collectorsname = serializers.SerializerMethodField()
	organisationtype = serializers.SerializerMethodField()
	images = serializers.SerializerMethodField()

	class Meta:
		model = Observations
		fields = '__all__'

	def get_collectorsname(self, obj):
		"""Return collector name."""
		if obj.collector_name:
			return obj.collector_name
		else:
			user = obj.user
			return (
				f"{user.first_name}"
				if user and user.first_name
				else "Anonymous"
			)

	def get_organisationtype(self, obj):
		"""Return organisation type."""
		try:
			user_profile = UserProfile.objects.get(user=obj.user)
		except UserProfile.DoesNotExist:
			user_profile = None

		if user_profile:
			organisation_type = user_profile.organisation_type
			serialized_organisation_type = LookupSerializer(
				organisation_type).data
			return serialized_organisation_type
		else:
			return None

	def get_images(self, obj: Observations):
		"""Return images of site."""
		return ObservationPestImageSerializer(
			obj.observationpestimage_set.all().order_by('pest__name', '-id'), many=True
		).data

	# Include the comment field explicitly
	comment = serializers.CharField(allow_blank=True, default='')

	def create(self, validated_data):
		if 'comment' not in validated_data:
			validated_data['comment'] = ''
		return super().create(validated_data)
	 


class SitesWithObservationsSerializer(serializers.ModelSerializer):
	sitename = serializers.CharField(source='site_name')
	rivername = serializers.CharField(source='river_name')
	sitedescription = serializers.CharField(source='description')
	rivercategory = serializers.CharField(source='river_cat')
	longitude = serializers.FloatField(source='the_geom.x')
	latitude = serializers.FloatField(source='the_geom.y')
	images = serializers.SerializerMethodField()

	class Meta:
		model = Sites
		fields = '__all__'


	def get_images(self, obj: Sites):
		"""Return images of site."""
		return SiteImageSerializer(
			obj.siteimage_set.all(), many=True
		).data

	def to_representation(self, instance):
		data = super().to_representation(instance)

		# Query for observations related to the site
		observations = Observations.objects.filter(site_id=instance.gid).order_by('-obs_date', '-gid')
		serializer = ObservationsSerializer(observations, many=True)

		combined_data = {
			'site': {
				'gid': instance.gid,
				'sitename': data['sitename'],
				'rivername': data['rivername'],
				'rivercategory': data['rivercategory'],
				'sitedescription': data['sitedescription'],
				'longitude': instance.the_geom.x,
				'latitude': instance.the_geom.y,
				'images': data['images'],
			},
			'observations': serializer.data,
		}

		return combined_data

class ObservationsDataOnlySerializer(serializers.ModelSerializer):
	"""Serializer of observation."""
	collector_name = serializers.SerializerMethodField()
	images = serializers.SerializerMethodField()
	

	class Meta:
		model = Observations
		fields = '__all__'
		
	
	def get_collector_name(self, obj):
		if obj.collector_name:
			return obj.collector_name
		else:
			user = obj.user
			return (
				f"{user.first_name}"
				if user and user.first_name
				else "Anonymous"
			)

	def get_images(self, obj: Observations):
		"""Return images of observation with full URL paths."""
		request = self.context.get('request')
		images = obj.observationpestimage_set.all().order_by('pest__name', '-id')
		serialized_images = ObservationPestImageSerializer(images, many=True).data
		
		for image in serialized_images:
			if 'image' in image and request:
				image['image'] = request.build_absolute_uri(image['image'])
		
		return serialized_images

	comment = serializers.CharField(allow_blank=True, default='')

	def create(self, validated_data):
		if 'comment' not in validated_data:
			validated_data['comment'] = ''
		return super().create(validated_data)
	 

class SitesAndObservationsSerializer(serializers.ModelSerializer):
	sitename = serializers.CharField(source='site_name')
	rivername = serializers.CharField(source='river_name')
	sitedescription = serializers.CharField(source='description')
	rivercategory = serializers.CharField(source='river_cat')
	observations = serializers.SerializerMethodField()
	images = serializers.SerializerMethodField()

	def get_images(self, obj: Sites):
		"""Return images of site with full URL paths."""
		request = self.context.get('request')
		images = obj.siteimage_set.all()
		serialized_images = SiteImageSerializer(images, many=True).data
		
		for image in serialized_images:
			if 'image' in image and request:
				image['image'] = request.build_absolute_uri(image['image'])
		
		return serialized_images

	class Meta:
		model = Sites
		fields = [
			'gid', 
			'sitename', 
			'rivername', 
			'sitedescription', 
			'rivercategory',
			'images', 
			'observations'
		]

	def get_observations(self, obj):
		observations = Observations.objects.filter(site=obj).order_by('-obs_date', '-gid')
		return ObservationsDataOnlySerializer(observations, many=True, context=self.context).data

	def to_representation(self, instance):
		data = super().to_representation(instance)
		combined_data = {
			'site': {
				'gid': data['gid'],
				'sitename': data['sitename'],
				'rivername': data['rivername'],
				'rivercategory': data['rivercategory'],
				'sitedescription': data['sitedescription'],
				'images': data['images'],
				'observations': data['observations'],
			},
			
		}
		return combined_data
