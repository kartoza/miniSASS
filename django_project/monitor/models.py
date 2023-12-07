from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
from dirtyfields import DirtyFieldsMixin
from django.contrib.gis.db import models as geometry_fields


class Organisations(models.Model):
    id = models.AutoField(primary_key=True)
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


class Assessment(models.Model):
    assessment_id = models.AutoField(primary_key=True)
    assessment_data = models.JSONField(blank=True,null=True)


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
    time_stamp = models.DateTimeField(auto_now=True)
    assessment_id = models.ForeignKey(Assessment, on_delete=models.CASCADE,blank=True,null=True)
    minisass_score = models.FloatField(blank=True,null=True)
    minisass_ML_score = models.FloatField(blank=True,null=True)
    ml_model_version = models.CharField(max_length=255,blank=True,null=True)
    ml_model_type = models.CharField(max_length=255,blank=True,null=True)
    site_image = models.ImageField(upload_to='site_images/',blank=True,null=True)
    objects = models.Manager()

    class Meta:
        db_table = 'sites'

    def __str__(self):
        return self.site_name

class ImageData(models.Model):
    image_id = models.AutoField(primary_key=True)
    ml_prediction = models.CharField(max_length=255,blank=True,null=True),
    user_choice = models.CharField(max_length=255,blank=True,null=True)
    image_name = models.CharField(max_length=255,blank=True,null=True)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE,blank=True,null=True)


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
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
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
    score = models.DecimalField(max_digits=4, decimal_places=2,default=0)
    site = models.ForeignKey(Sites, on_delete=models.CASCADE, related_name='observation', blank=True, null=True)
    time_stamp = models.DateTimeField(auto_now=True)
    comment = models.CharField(max_length=255, null=True, blank=True)
    obs_date = models.DateField(blank=True, null=True)
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
