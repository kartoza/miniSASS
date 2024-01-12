import os
import shutil
import time

from dirtyfields import DirtyFieldsMixin
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.gis.db import models as geometry_fields
from django.db import models
from django.db.models.signals import pre_save, post_delete, post_save
from django.dispatch import receiver

from minisass.utils import delete_file_field, delete_from_minio, get_path_string
from monitor.utils import send_to_ai_bucket


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
    assessment = models.AutoField(primary_key=True)
    assessment_data = models.JSONField(blank=True,null=True)

    def __str__(self):
        return self.assessment

class Sites(models.Model):
    RIVER_CATS = (
        (u'rocky', u'Rocky'),
        (u'sandy', u'Sandy')
    )
    gid = models.AutoField(primary_key=True, editable=False)
    the_geom = geometry_fields.PointField()
    site_name = models.CharField(max_length=50, blank=False)
    river_name = models.CharField(max_length=50, blank=False)
    description = models.CharField(max_length=255, blank=True)
    river_cat = models.CharField(max_length=5, choices=RIVER_CATS, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_stamp = models.DateTimeField(auto_now=True)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE,blank=True,null=True)
    objects = models.Manager()

    class Meta:
        db_table = 'sites'
        verbose_name_plural = 'Sites'

    def __str__(self):
        return self.site_name

    @property
    def folder(self):
        """Return folder of site"""
        return os.path.join(
            settings.MINIO_ROOT,
            settings.MINIO_BUCKET,
            f'{self.gid}'
        )

def site_image_path(instance, filename):
    return os.path.join(
        settings.MINIO_BUCKET,
        'sites',
        f'{instance.site_id}',
        filename
    )


class SiteImage(models.Model):
    """Image for a site."""
    site = models.ForeignKey(Sites, on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to=site_image_path, max_length=250, storage=settings.MINION_STORAGE
    )

    def delete_image(self):
        """delete image."""
        delete_file_field(self.image)


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
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True
    )
    minisass_ml_score = models.FloatField(blank=True,null=True)
    ml_model_version = models.CharField(max_length=255,blank=True,null=True)
    ml_model_type = models.CharField(max_length=255,blank=True,null=True)
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
    score = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    site = models.ForeignKey(
        Sites, on_delete=models.CASCADE, related_name='observation',
        blank=True, null=True
    )
    time_stamp = models.DateTimeField(auto_now=True)
    comment = models.CharField(max_length=255, null=True, blank=True)
    obs_date = models.DateField(blank=True, null=True)
    flag = models.CharField(
        max_length=5, choices=FLAG_CATS, default='dirty', blank=False,
        help_text='Flag whether observation comes from expert or novice'
    )
    is_validated = models.BooleanField(
        default=False,
        help_text='Flag whether observation correctness has been validated'
    )
    water_clarity = models.DecimalField(
        max_digits=8, decimal_places=1, blank=True, null=True
    )
    water_temp = models.DecimalField(
        max_digits=5, decimal_places=1, blank=True, null=True
    )
    ph = models.DecimalField(
        max_digits=4, decimal_places=1, blank=True, null=True
    )
    diss_oxygen = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True
    )
    diss_oxygen_unit = models.CharField(
        max_length=8, choices=UNIT_DO_CATS, default='mgl', blank=True
    )
    elec_cond = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True
    )
    elec_cond_unit = models.CharField(
        max_length=8, choices=UNIT_EC_CATS, default='mS/m', blank=True
    )

    class Meta:
        db_table = 'observations'
        verbose_name_plural = 'Observations'

    def save(self, *args, **kwargs):
        if self.user:
            if self.user.userprofile.is_expert:
                self.is_validated = True
        if self.comment is None:
            self.comment = ''
        return super(Observations, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.obs_date) + ': ' + self.site.site_name


def observation_pest_image_path(instance, filename):
    return os.path.join(
        settings.MINIO_BUCKET,
        'observations',
        'clean' if instance.valid or instance.observation.flag == 'clean' else 'dirty',
        get_path_string(instance.pest.name),
        f'{instance.observation.site_id}',
        f'{instance.observation_id}',
        filename
    )


class Pest(models.Model):
    """Pest model."""
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        """Return the name."""
        return self.name


class ObservationPestImage(models.Model):
    """Image for site and observation for a site."""
    observation = models.ForeignKey(Observations, on_delete=models.CASCADE)
    pest = models.ForeignKey(Pest, on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to=observation_pest_image_path, max_length=250, storage=settings.MINION_STORAGE
    )
    valid = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Check image as valid if uploaded by expert.
        if self.observation.user.userprofile.is_expert:
            self.valid = True
        return super().save(*args, **kwargs)

    def get_minio_key(self):
        """
        Return S3/Minio key without bucket
        """
        destination = os.path.join(*self.image.name.split(os.sep)[1:])
        return destination

    def delete_image(self):
        """delete image."""
        delete_file_field(self.image)
        delete_from_minio(self.get_minio_key())

    def update_image_path(self):
        initial_path = self.image.path
        filename = os.path.basename(self.image.path)

        new_name = observation_pest_image_path(self, filename)
        new_path = os.path.join(settings.MINIO_ROOT, new_name)

        # Create dir if necessary and move file
        if not os.path.exists(os.path.dirname(new_path)):
            os.makedirs(os.path.dirname(new_path))
        try:
            os.rename(initial_path, new_path)
        except (FileNotFoundError, FileExistsError):
            return

        self.image.name = new_name


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


@receiver(post_delete, sender=Sites)
def site_delete(sender, instance, **kwargs):
    if os.path.exists(instance.folder):
        shutil.rmtree(instance.folder)


@receiver(post_delete, sender=SiteImage)
@receiver(post_delete, sender=ObservationPestImage)
def delete_image(sender, instance, **kwargs):
    instance.delete_image()

@receiver(pre_save, sender=ObservationPestImage)
def check_save_image(sender, instance: ObservationPestImage, **kwargs):
    try:
        old_instance = ObservationPestImage.objects.get(id=instance.id)
    except ObservationPestImage.DoesNotExist:
        return

    if instance.valid is True and old_instance.valid is False:
        if instance.image.name != old_instance.image.name:
            instance.send_to_ai_bucket = True
            return

        instance.observation.is_validated = True
        instance.observation.save()

        instance.update_image_path()
        instance.send_to_ai_bucket = True


@receiver(post_save, sender=ObservationPestImage)
def post_save_image(sender, instance, created: ObservationPestImage, **kwargs):
    if created and instance.valid:
        while True:
            if os.path.exists(instance.image.path):
                break
            time.sleep(1)
        send_to_ai_bucket(instance)

    elif getattr(instance, 'send_to_ai_bucket', False):
        send_to_ai_bucket(instance)
