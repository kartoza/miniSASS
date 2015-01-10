# from django.db import models
# Import separately
from django.contrib.gis.db import models # defines geometry field types
from django.contrib.auth.models import User # refers to auth_user table
from django.template.defaultfilters import escape
from django.core.urlresolvers import reverse
from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from dirtyfields import DirtyFieldsMixin

# django-cms imports
from cms.models import CMSPlugin

# Python imports
from datetime import datetime

# Create your models here.


class Organisations(models.Model):
    ORG_CATS = (
        (u'school', u'School'),
        (u'ngo', u'NGO'),
        (u'conservancy', u'Conservancy'),
        (u'private', u'Private citizen'),
        (u'government', u'Government department')
    )
    org_name = models.CharField(max_length=100, blank=True)
    org_type = models.CharField(max_length=11, choices=ORG_CATS, blank=True)

    class Meta:
        db_table = u'organisations'

    def __unicode__(self):
        return self.org_name


class Schools(models.Model):
    gid = models.AutoField(primary_key=True, editable=False)
    the_geom = models.PointField()
    natemis = models.IntegerField()
    school = models.CharField(max_length=255)
    province = models.CharField(max_length=15)
    phase = models.CharField(max_length=12)
    objects = models.GeoManager()

    class Meta:
        db_table = u'schools'
        managed=False

    def __unicode__(self):
        return self.name


class Sites(models.Model):
    RIVER_CATS = (
        (u'rocky', u'Rocky'),
        (u'sandy', u'Sandy')
    )
    gid = models.AutoField(primary_key=True, editable=False)
    the_geom = models.PointField()
    site_name = models.CharField(max_length=15, blank=False)
    river_name = models.CharField(max_length=15, blank=False)
    description = models.CharField(max_length=255, blank=True)
    river_cat = models.CharField(max_length=5, choices=RIVER_CATS, blank=True)
    user = models.ForeignKey(User)
    time_stamp = models.DateTimeField(auto_now=True, auto_now_add=True)
    objects = models.GeoManager()

    class Meta:
        db_table = u'sites'

    def __unicode__(self):
        return self.site_name


class ArchivedSites(models.Model):
    """Model for keeping the deleted sites."""
    RIVER_CATS = (
        (u'rocky', u'Rocky'),
        (u'sandy', u'Sandy')
    )
    gid = models.AutoField(primary_key=True, editable=False)
    the_geom = models.PointField()
    site_name = models.CharField(max_length=15, blank=False)
    river_name = models.CharField(max_length=15, blank=False)
    description = models.CharField(max_length=255, blank=True)
    river_cat = models.CharField(max_length=5, choices=RIVER_CATS, blank=True)
    user_id = models.IntegerField(default=0)
    time_stamp = models.DateTimeField(auto_now=True, auto_now_add=True)
    objects = models.GeoManager()

    class Meta:
        db_table = u'archived_sites'

    def __unicode__(self):
        return self.site_name


class Observations(models.Model, DirtyFieldsMixin):
    FLAG_CATS = (
        (u'dirty', u'Dirty'),
        (u'clean', u'Clean')
    )
    UNIT_DO_CATS = (
        (u'mgl', u'mg/l'),
        (u'%DO', u'%DO'),
        (u'PPM', u'PPM'),
        (u'na', u'Unknown')
    )
    UNIT_EC_CATS = (
        (u'S/m', u'S/m'),
        (u'\u00B5S/cm', u'\u00B5S/cm'),
        (u'mS/m', u'mS/m'),
        (u'na', u'Unknown')
    )
    gid = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User)
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
    score = models.DecimalField(max_digits=4, decimal_places=2)
    site = models.ForeignKey(Sites, db_column='site',related_name='observation')
    time_stamp = models.DateTimeField(auto_now=True, auto_now_add=True)
    comment = models.CharField(max_length=255, blank=True)
    obs_date = models.DateField()
    flag = models.CharField(max_length=5, choices=FLAG_CATS, default='dirty', blank=False)
    water_clarity = models.DecimalField(max_digits=8, decimal_places=1, blank=True, null=True)
    water_temp = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    ph = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    diss_oxygen = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    diss_oxygen_unit = models.CharField(max_length=8, choices=UNIT_DO_CATS, default='mgl', blank=True)
    elec_cond = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    elec_cond_unit = models.CharField(max_length=8, choices=UNIT_EC_CATS, default='mSm', blank=True)
    objects = models.GeoManager()

    class Meta:
        db_table = u'observations'

    def __unicode__(self):
        return str(self.obs_date) + ': ' + self.site.site_name


class ArchivedObservations(models.Model, DirtyFieldsMixin):
    """Model for keeping the deleted Observations."""
    FLAG_CATS = (
        (u'dirty', u'Dirty'),
        (u'clean', u'Clean')
    )
    UNIT_DO_CATS = (
        (u'mgl', u'mg/l'),
        (u'%DO', u'%DO'),
        (u'PPM', u'PPM'),
        (u'na', u'Unknown')
    )
    UNIT_EC_CATS = (
        (u'S/m', u'S/m'),
        (u'\u00B5S/cm', u'\u00B5S/cm'),
        (u'mS/m', u'mS/m'),
        (u'na', u'Unknown')
    )
    gid = models.AutoField(primary_key=True, editable=False)
    user_id = models.IntegerField(default=0)
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
    score = models.DecimalField(max_digits=4, decimal_places=2)
    site_id = models.IntegerField(default=0)
    time_stamp = models.DateTimeField(auto_now=True, auto_now_add=True)
    comment = models.CharField(max_length=255, blank=True)
    obs_date = models.DateField()
    flag = models.CharField(max_length=5, choices=FLAG_CATS, default='dirty', blank=False)
    water_clarity = models.DecimalField(max_digits=8, decimal_places=1, blank=True, null=True)
    water_temp = models.DecimalField(max_digits=5, decimal_places=1, blank=True)
    ph = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    diss_oxygen = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    diss_oxygen_unit = models.CharField(max_length=8, choices=UNIT_DO_CATS, default='mgl', blank=True)
    elec_cond = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    elec_cond_unit = models.CharField(max_length=8, choices=UNIT_EC_CATS, default='mSm', blank=True)
    objects = models.GeoManager()

    class Meta:
        db_table = u'archived_observations'

    def __unicode__(self):
        return str(self.obs_date)


class ObservationPlugin(CMSPlugin):
    """ This is a Django CMS plugin for the above Observations monitor model class
    """
#     observation = models.ForeignKey(Observations, related_name='plugins')
#
#     def __unicode__(self):
#         return self.observation.site.name


def send_confirmation_email(observation):
    """Helper function to send email content based on observation.

    :param observation: The Observation.
    :type observation: Observations

    """
    email_subject = 'Your Observation has been Verified'

    email_content = '''
Dear %s,

We want to inform you that your observation has been verified. Below is the \
detail of your observation.

Site Details:
River name: %s
Site name: %s
Site Description: %s
Category: %s

Observation Details:
Date: %s
Collector's name: %s
Comments/notes: %s


Kind regards,
The miniSASS team.
    ''' % (
        observation.user.get_full_name(),
        observation.site.river_name,
        observation.site.site_name,
        observation.site.description,
        observation.site.river_cat,

        observation.obs_date.strftime("%d %b %Y"),
        observation.user.get_full_name(),
        observation.comment,
    )

    email_sender = 'info@minisass.org'

    observation.user.email_user(email_subject, email_content, email_sender)


@receiver(pre_save, sender=Observations)
def send_email_to_user(sender, **kwargs):
    observation = kwargs.get('instance')
    if not observation.is_dirty():
        return
    dirty_fields = observation.get_dirty_fields()
    # Check is it verified (the previous state: flag==dirty and the current
    # state == clean)
    if dirty_fields.get('flag') == 'dirty' and observation.flag == 'clean':
        send_confirmation_email(observation)


@receiver(pre_delete, sender=Sites)
def archive_site(sender, instance, using, **kwargs):
    archived_site = ArchivedSites()

    archived_site.the_geom = instance.the_geom
    archived_site.site_name = instance.site_name
    archived_site.river_name = instance.river_name
    archived_site.description = instance.description
    archived_site.river_cat = instance.river_cat
    archived_site.user = instance.user.id
    archived_site.time_stamp = instance.time_stamp
    archived_site.objects = models.GeoManager()

    archived_site.save()

@receiver(pre_delete, sender=Observations)
def archive_observation(sender, instance, using, **kwargs):
    observation = instance
    archived_observation = ArchivedObservations()

    archived_observation.user_id = observation.user.id
    archived_observation.flatworms = observation.flatworms
    archived_observation.worms = observation.worms
    archived_observation.leeches = observation.leeches
    archived_observation.crabs_shrimps = observation.crabs_shrimps
    archived_observation.stoneflies = observation.stoneflies
    archived_observation.minnow_mayflies = observation.minnow_mayflies
    archived_observation.other_mayflies = observation.other_mayflies
    archived_observation.damselflies = observation.damselflies
    archived_observation.dragonflies = observation.dragonflies
    archived_observation.bugs_beetles = observation.bugs_beetles
    archived_observation.caddisflies = observation.caddisflies
    archived_observation.true_flies = observation.true_flies
    archived_observation.snails = observation.snails
    archived_observation.score = observation.score
    archived_observation.site_id = observation.site.gid
    archived_observation.time_stamp = observation.time_stamp
    archived_observation.comment = observation.comment
    archived_observation.obs_date = observation.obs_date
    archived_observation.flag = observation.flag
    archived_observation.water_clarity = observation.water_clarity
    archived_observation.water_temp = observation.water_temp
    archived_observation.ph = observation.ph
    archived_observation.diss_oxygen = observation.diss_oxygen
    archived_observation.diss_oxygen_unit = observation.diss_oxygen_unit
    archived_observation.elec_cond = observation.elec_cond
    archived_observation.elec_cond_unit = observation.elec_cond_unit
    archived_observation.objects = models.GeoManager()

    archived_observation.save()
