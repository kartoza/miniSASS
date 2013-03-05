# from django.db import models
# Import separately
from django.contrib.gis.db import models # defines geometry field types
from django.contrib.auth.models import User # refers to auth_user table
from django.template.defaultfilters import escape
from django.core.urlresolvers import reverse

# django-cms imports
from cms.models import CMSPlugin

# Python imports
from datetime import datetime

# Create your models here.

class Sites(models.Model):
    RIVER_CATS = (
        (u'rocky', u'Rocky'),
        (u'sandy', u'Sandy')
    )
    gid = models.AutoField(primary_key=True, editable=False)
    the_geom = models.PointField()
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    river_cat = models.CharField(max_length=5, choices=RIVER_CATS, blank=True)
    objects = models.GeoManager()
    class Meta:
        db_table = u'sites'
    def __unicode__(self):
        return self.name
               
class Observations(models.Model):
    gid = models.AutoField(primary_key=True, editable=False)
    score = models.DecimalField(max_digits=4, decimal_places=2, editable=False)
    site = models.ForeignKey(Sites, db_column='gid')
    time_stamp = models.DateTimeField()
    comment = models.CharField(max_length=255, blank=True)
    user_id = models.ForeignKey(User)
    flatworms = models.BooleanField(default=False)
    worms = models.BooleanField(default=False)
    leeches = models.BooleanField(default=False)
    crabs_shrimps = models.BooleanField(default=False)
    stoneflies = models.BooleanField(default=False)
    minnow_mayflies = models.BooleanField(default=False)
    other_mayflies = models.BooleanField(default=False)
    damselflies = models.BooleanField(default=False)
    dragonflies = models.BooleanField(default=False)
    bugs_beetles = models.BooleanField(default=False)
    caddisflies = models.BooleanField(default=False)
    true_flies = models.BooleanField(default=False)
    snails = models.BooleanField(default=False)
    objects = models.GeoManager()
    class Meta:
        db_table = u'observations'

class miniSASSmonitor(models.Model):
    """ This is a model class to contain the information for a miniSASS event.

    Please add fields as required.
    """
    nearest_place_name = models.CharField(max_length=80, blank=False)
    date_created = models.DateTimeField(auto_now_add = True, editable = False)

    def __unicode__(self):
        return self.nearest_place_name


class MonitorPlugin(CMSPlugin):
    """ This is a Django CMS plugin for the above miniSASS monitor model class
    """
    monitor = models.ForeignKey('monitor.miniSASSmonitor', related_name='plugins')

    def __unicode__(self):
        return self.monitor.nearest_place_name
