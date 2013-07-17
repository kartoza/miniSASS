from django.contrib.auth.models import User
from django.db import models


class Lookup(models.Model):
    """ Provides a lookup table for populating drop-down lists
    """
    container = models.ForeignKey(
            'self', 
            limit_choices_to={'active':True, 'container':None}, 
            blank=True, null=True)
    rank = models.PositiveIntegerField(
            default=0)
    description = models.CharField(
            max_length=50, 
            blank=False)
    active = models.BooleanField(
            default=True)

    def __unicode__(self):
        return self.description


class UserProfile(models.Model):
    """ Store extra user profile information here
    """
    user = models.OneToOneField(User, blank=False)
    organisation_type = models.ForeignKey(Lookup, blank=False)
    organisation_name = models.CharField(max_length=255, blank=True)

    def __unicode__(self):
        return "%s: %s" % (
            self.organisation_type, 
            self.organisation_name and True or 'Unknown'
        )
