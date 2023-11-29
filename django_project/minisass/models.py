from django.db import models


class GroupScores(models.Model):
    name = models.CharField(max_length=255)
    sensitivity_score = models.DecimalField(max_digits=5, decimal_places=2)

class Video(models.Model):
    title = models.CharField(max_length=255)
    embed_code = models.TextField()

    def __str__(self):
        return self.title
