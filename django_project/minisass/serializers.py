# serializers.py

from rest_framework import serializers
from minisass.models import GroupScores

class GroupScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupScores
        fields = ['id', 'name', 'sensitivity_score']
