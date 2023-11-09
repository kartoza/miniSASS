from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from dirtyfields import DirtyFieldsMixin
from django.contrib.gis.db import models as geometry_fields


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
        db_table = 'organisations'

    def __str__(self):
        return self.org_name


class Schools(models.Model):
    gid = models.AutoField(primary_key=True, editable=False)
    the_geom = geometry_fields.PointField()
    natemis = models.IntegerField()
    school = models.CharField(max_length=255)
    province = models.CharField(max_length=15)
    phase = models.CharField(max_length=12)
    objects = models.Manager()

    class Meta:
        db_table = 'schools'
        managed = False

    def __str__(self):
        return self.school


class Sites(models.Model):
    RIVER_CATS = (
        (u'rocky', u'Rocky'),
        (u'sandy', u'Sandy')
    )
    gid = models.AutoField(primary_key=True, editable=False)
    the_geom = geometry_fields.PointField()
    site_name = models.CharField(max_length=15, blank=False)
    river_name = models.CharField(max_length=15, blank=False)
    description = models.CharField(max_length=255, blank=True)
    river_cat = models.CharField(max_length=5, choices=RIVER_CATS, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_stamp = models.DateTimeField(auto_now=True, auto_now_add=True)
    objects = models.Manager()

    class Meta:
        db_table = 'sites'

    def __str__(self):
        return self.site_name


# class ArchivedSites(models.Model):
#     RIVER_CATS = (
#         (u'rocky', u'Rocky'),
#         (u'sandy', u'Sandy')
#     )
#     gid = models.AutoField(primary_key=True, editable=False)
#     the_geom = models.PointField()
#     site_name = models.CharField(max_length=15, blank=False)
#     river_name = models.CharField(max_length=15, blank=False)
#     description = models.CharField(max_length=255, blank=True)
#     river_cat = models.CharField(max_length=5, choices=RIVER_CATS, blank=True)
#     user_id = models.IntegerField(default=0)
#     time_stamp = models.DateTimeField(auto_now=True, auto_now_add=True)
#     objects = models.Manager()

#     class Meta:
#         db_table = 'archived_sites'

#     def __str__(self):
#         return self.site_name


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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
    site = models.ForeignKey(Sites, on_delete=models.CASCADE, related_name='observation')
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
    elec_cond_unit = models.CharField(max_length=8, choices=UNIT_EC_CATS, default='mS/m', blank=True)

    class Meta:
        db_table = 'observations'

    def __str__(self):
        return str(self.obs_date) + ': ' + self.site.site_name


# class ArchivedObservations(models.Model, DirtyFieldsMixin):
#     FLAG_CATS = (
#         (u'dirty', u'Dirty'),
#         (u'clean', u'Clean')
#     )
#     UNIT_DO_CATS = (
#         (u'mgl', u'mg/l'),
#         (u'%DO', u'%DO'),
#         (u'PPM', u'PPM'),
#         (u'na', u'Unknown')
#     )
#     UNIT_EC_CATS = (
#         (u'S/m', u'S/m'),
#         (u'\u00B5S/cm', u'\u00B5S/cm'),
#         (u'mS/m', u'mS/m'),
#         (u'na', u'Unknown')
#     )
#     gid = models.AutoField(primary_key=True, editable=False)
#     user_id = models.IntegerField(default=0)
#     flatworms = models.BooleanField(default=False)
#     worms = models.BooleanField(default=False)
#     leeches = models.BooleanField(default=False)
#     crabs_shrimps = models.BooleanField(default=False)
#     stoneflies = models.BooleanField(default=False)
#     minnow_mayflies = models.BooleanField(default=False)
#     other_mayflies = models.BooleanField(default=False)
#     damselflies = models.BooleanField(default=False)
#     dragonflies = models.BooleanField(default=False)
#     bugs_beetles = models.BooleanField(default=False)
#     caddisflies = models.BooleanField(default=False)
#     true_flies = models.BooleanField(default=False)
#     snails = models.BooleanField(default=False)
#     score = models.DecimalField(max_digits=4, decimal_places=2)
#     site_id = models.IntegerField(default=0)
#     time_stamp = models.DateTimeField(auto_now=True, auto_now_add=True)
#     comment = models.CharField(max_length=255, blank=True)
#     obs_date = models.DateField()
#     flag = models.CharField(max_length=5, choices=FLAG_CATS, default='dirty', blank=False)
#     water_clarity = models.DecimalField(max_digits=8, decimal_places=1, blank=True, null=True)
#     water_temp = models.DecimalField(max_digits=5, decimal_places=1, blank=True)
#     ph = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
#     diss_oxygen = models.DecimalField(max_digits=8, decimal_places=2, blank=True, nullTrue)
#     diss_oxygen_unit = models.CharField(max_length=8, choices=UNIT_DO_CATS, default='mgl', blank=True)
#     elec_cond = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     elec_cond_unit = models.CharField(max_length=8, choices=UNIT_EC_CATS, default='mSm', blank=True)

#     class Meta:
#         db_table = 'archived_observations'

#     def __str__(self):
#         return str(self.obs_date)


# Helper function to send email content based on observation
def send_confirmation_email(observation):
    email_subject = 'Your Observation has been Verified'

    email_content = f'''
Dear {observation.user.get_full_name()},

We want to inform you that your observation has been verified. Below is the \
detail of your observation.

Site Details:
River name: {observation.site.river_name}
Site name: {observation.site.site_name}
Site Description: {observation.site.description}
Category: {observation.site.river_cat}

Observation Details:
Date: {observation.obs_date.strftime("%d %b %Y")}
Collector's name: {observation.user.get_full_name()}
Comments/notes: {observation.comment}

Kind regards,
The miniSASS team.
    '''

    email_sender = 'info@minisass.org'

    observation.user.email_user(email_subject, email_content, email_sender)

# Signal receiver to send email to the user when an observation is verified
@receiver(pre_save, sender=Observations)
def send_email_to_user(sender, instance, **kwargs):
    if not instance.is_dirty():
        return
    dirty_fields = instance.get_dirty_fields()
    # Check if it is verified (the previous state: flag==dirty and the current
    # state == clean)
    if dirty_fields.get('flag') == 'dirty' and instance.flag == 'clean':
        send_confirmation_email(instance)

# # Signal receiver to archive a site when it is deleted
# @receiver(pre_delete, sender=Sites)
# def archive_site(sender, instance, using, **kwargs):
#     archived_site = ArchivedSites()

#     archived_site.the_geom = instance.the_geom
#     archived_site.site_name = instance.site_name
#     archived_site.river_name = instance.river_name
#     archived_site.description = instance.description
#     archived_site.river_cat = instance.river_cat
#     archived_site.user = instance.user.id
#     archived_site.time_stamp = instance.time_stamp
#     archived_site.save()

# # Signal receiver to archive an observation when it is deleted
# @receiver(pre_delete, sender=Observations)
# def archive_observation(sender, instance, using, **kwargs):
#     archived_observation = ArchivedObservations()

#     archived_observation.user_id = instance.user.id
#     archived_observation.flatworms = instance.flatworms
#     archived_observation.worms = instance.worms
#     archived_observation.leeches = instance.leeches
#     archived_observation.crabs_shrimps = instance.crabs_shrimps
#     archived_observation.stoneflies = instance.stoneflies
#     archived_observation.minnow_mayflies = instance.minnow_mayflies
#     archived_observation.other_mayflies = instance.other_mayflies
#     archived_observation.damselflies = instance.damselflies
#     archived_observation.dragonflies = instance.dragonflies
#     archived_observation.bugs_beetles = instance.bugs_beetles
#     archived_observation.caddisflies = instance.caddisflies
#     archived_observation.true_flies = instance.true_flies
#     archived_observation.snails = instance.snails
#     archived_observation.score = instance.score
#     archived_observation.site_id = instance.site.gid
#     archived_observation.time_stamp = instance.time_stamp
#     archived_observation.comment = instance.comment
#     archived_observation.obs_date = instance.obs_date
#     archived_observation.flag = instance.flag
#     archived_observation.water_clarity = instance.water_clarity
#     archived_observation.water_temp = instance.water_temp
#     archived_observation.ph = instance.ph
#     archived_observation.diss_oxygen = instance.diss_oxygen
#     archived_observation.diss_oxygen_unit = instance.diss_oxygen_unit
#     archived_observation.elec_cond = instance.elec_cond
#     archived_observation.elec_cond_unit = instance.elec_cond_unit
#     archived_observation.save()