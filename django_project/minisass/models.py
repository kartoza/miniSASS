import os
from django.db import models
from django.conf import settings


class GroupScores(models.Model):
    DB_FIELDS = [
        ('bugs_beetles', 'bugs_beetles'),
        ('caddisflies', 'caddisflies'),
        ('crabs_shrimps', 'crabs_shrimps'),
        ('damselflies', 'damselflies'),
        ('dragonflies', 'dragonflies'),
        ('flatworms', 'flatworms'),
        ('leeches', 'leeches'),
        ('minnow_mayflies', 'minnow_mayflies'),
        ('other_mayflies', 'other_mayflies'),
        ('snails', 'snails'),
        ('stoneflies', 'stoneflies'),
        ('true_flies', 'true_flies'),
        ('worms', 'worms')
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    db_field = models.CharField(
        max_length=25, choices=DB_FIELDS, blank=True
    )
    sensitivity_score = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Group Scores'

class Video(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    embed_code = models.TextField()

    def __str__(self):
        return self.title


def mobile_app_path(instance, filename):
    return os.path.join(
        settings.MINIO_BUCKET,
        'mobile_app',
        filename
    )


class MobileApp(models.Model):
    date = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100, blank=False, null=False)
    file = models.FileField(upload_to=mobile_app_path, null=True)
    active = models.BooleanField(default=False)
