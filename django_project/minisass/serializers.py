from rest_framework import serializers
from minisass.models import GroupScores
from minisass.models import Video

class GroupScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupScores
        fields = ['id', 'name', 'sensitivity_score']


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['title', 'embed_code']
