from django.db import models
# Import separately
from django.contrib.gis.db import models # defines geometry field types
from django.contrib.auth.models import User # refers to auth_user table
#from django.template.defaultfilters import escape
#from django.core.urlresolvers import reverse

# Python imports
#from datetime import datetime

# Create your models here.

class Sites(models.Model):
    gid = models.IntegerField(primary_key=True)
    the_geom = models.TextField(blank=True) # This field type is a guess.
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    river_cat = models.CharField(max_length=5, blank=True)
    class Meta:
        db_table = u'sites'
        
class Observations(models.Model):
    gid = models.IntegerField(primary_key=True)
    score = models.DecimalField(null=True, max_digits=4, decimal_places=2, blank=True)
    site = models.ForeignKey(Sites, null=True, db_column='site', blank=True)
    time_stamp = models.DateTimeField(null=True, blank=True)
    comment = models.CharField(max_length=255, blank=True)
    user_id = models.IntegerField(null=True, blank=True)
    flatworms = models.BooleanField(null=True, blank=True)
    worms = models.BooleanField(null=True, blank=True)
    leeches = models.BooleanField(null=True, blank=True)
    crabs_shrimps = models.BooleanField(null=True, blank=True)
    stoneflies = models.BooleanField(null=True, blank=True)
    minnow_mayflies = models.BooleanField(null=True, blank=True)
    other_mayflies = models.BooleanField(null=True, blank=True)
    damselflies = models.BooleanField(null=True, blank=True)
    dragonflies = models.BooleanField(null=True, blank=True)
    bugs_beetles = models.BooleanField(null=True, blank=True)
    caddisflies = models.BooleanField(null=True, blank=True)
    true_flies = models.BooleanField(null=True, blank=True)
    snails = models.BooleanField(null=True, blank=True)
    class Meta:
        db_table = u'observations'

