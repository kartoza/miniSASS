# serializers.py

from rest_framework import serializers
from minisass.models import Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['title', 'embed_code']
