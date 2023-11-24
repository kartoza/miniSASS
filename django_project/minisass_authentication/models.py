from django.db import models
from django.conf import settings

# TODO might remove this as it is no longer neccessary
class Lookup(models.Model):
    container = models.ForeignKey(
        'self', 
        limit_choices_to={'active': True, 'container': None}, 
        blank=True, null=True,
        on_delete=models.SET_NULL
    )
    rank = models.PositiveIntegerField(default=0)
    description = models.CharField(max_length=50, blank=False)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.description

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=False)
    organisation_type = models.ForeignKey(
        Lookup, 
        limit_choices_to={'container__description': 'Organisation Type'}, 
        blank=False,
        null=True,
        on_delete=models.SET_NULL
    )
    organisation_name = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.organisation_type}: {self.organisation_name or 'Unknown'}"
