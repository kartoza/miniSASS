import os
from django.db import models
from django.conf import settings

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.contrib.auth.hashers import check_password


def certificate_path(instance, filename):
    return os.path.join(
        settings.MINIO_BUCKET,
        f'{instance.user.id}',
        filename
    )

PENDING_STATUS = 'PENDING'
APPROVED_STATUS = 'APPROVED'
REJECTED_STATUS = 'REJECTED'

EXPERT_APPROVAL_STATUS = (
    (PENDING_STATUS, PENDING_STATUS),
    (APPROVED_STATUS, APPROVED_STATUS),
    (REJECTED_STATUS, REJECTED_STATUS)
)


# TODO might remove this as it is no longer neccessary
class Lookup(models.Model):
    id = models.AutoField(primary_key=True)
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
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=False)
    organisation_type = models.ForeignKey(
        Lookup,
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )
    organisation_name = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    is_expert = models.BooleanField(default=False)
    is_password_enforced = models.BooleanField(
        default=True,
        help_text='Flag whether user has been enforced to use strong password'
    )
    expert_approval_status = models.CharField(
        default=REJECTED_STATUS,
        choices=EXPERT_APPROVAL_STATUS
    )
    certificate = models.FileField(
        null=True, blank=True,
        upload_to=certificate_path, storage=settings.MINION_STORAGE
    )

    def __str__(self):
        return f"{self.organisation_type}: {self.organisation_name or 'Unknown'}"

    def save(self, *args, **kwargs):
        if self.expert_approval_status == APPROVED_STATUS and self.certificate:
            self.is_expert = True
        super().save(*args, **kwargs)


class PasswordHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=False
    )
    hashed_password = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Password Histories'

    @classmethod
    def is_password_used(cls, user, plain_password):
        """
        Check whether password has been used for the specified user.
        """
        password_histories = PasswordHistory.objects.filter(user=user)
        for password_history in password_histories:
            if check_password(plain_password, password_history.hashed_password):
                return True
        return False


@receiver(post_save, sender=UserProfile)
def post_certificate_approve(sender, instance: UserProfile, **kwargs):
    if instance.expert_approval_status == APPROVED_STATUS and instance.certificate and instance.is_expert:
        email = instance.user.email

        message = render_to_string('profile/certificate_approved.html', {
            'full_name': '{} {}'.format(instance.user.first_name, instance.user.last_name)
        })

        send_mail(
            'Certificate Approved',
            None,
            settings.EXPERT_APPROVAL_RECIPIENT_EMAIL,
            [email],
            html_message=message
        )


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def post_user_save(sender, instance: settings.AUTH_USER_MODEL, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(
            user=instance,
            defaults={
                'is_password_enforced': True
            }
        )
    PasswordHistory.objects.get_or_create(
        user=instance,
        hashed_password=instance.password
    )
