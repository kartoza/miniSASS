from rest_framework import serializers
from minisass.models import GroupScores, Video, MobileApp


class GroupScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupScores
        fields = ['id', 'name', 'sensitivity_score']


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['title', 'embed_code']


class MobileAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = MobileApp
        fields = '__all__'