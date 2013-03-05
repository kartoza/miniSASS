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
