# models.py
from django.db import models


class GroupScores(models.Model):
    name = models.CharField(max_length=255)
    sensitivity_score = models.DecimalField(max_digits=5, decimal_places=2)
