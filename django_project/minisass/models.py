from django.db import models


class GroupScores(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    sensitivity_score = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

class Video(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    embed_code = models.TextField()

    def __str__(self):
        return self.title
