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
    
    SCHOOL = 'School'
    NGO = 'NGO'
    OTHER = 'Other'
    UNIVERSITY = 'University'
    CONSERVANCY = 'Conservancy'
    PRIVATE_INDIVIDUAL = 'Private Individual'
    CONSULTANCY = 'Consultancy'
    GOVERNMENT_DEPARTMENT = 'Government Department'

    ORGANISATION_TYPE_CHOICES = [
        (SCHOOL, 'School'),
        (NGO, 'NGO'),
        (OTHER, 'Other'),
        (UNIVERSITY, 'University'),
        (CONSERVANCY, 'Conservancy'),
        (PRIVATE_INDIVIDUAL, 'Private Individual'),
        (CONSULTANCY, 'Consultancy'),
        (GOVERNMENT_DEPARTMENT, 'Government Department'),
    ]

    organisation_type = models.CharField(
        max_length=50,
        choices=ORGANISATION_TYPE_CHOICES,
        default=OTHER,
    )

    organisation_name = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return f"{self.organisation_type}: {self.organisation_name or 'Unknown'}"
