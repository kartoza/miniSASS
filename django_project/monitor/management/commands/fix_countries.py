import os.path
import time

from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import User
from monitor.models import Sites
from minisass_authentication.admin.minisass import correct_country


class Command(BaseCommand):
    help = 'Fix site and user countries'

    def handle(self, *args, **kwargs):
        for site in Sites.objects.all():
            # if site has no country, set it
            if not site.country:
                try:
                    site.save(set_country=True)
                except Exception:
                    continue
                # set user country if empty
                if not site.user.userprofile.country:
                    site.user.userprofile.country = site.country
                    site.user.userprofile.save()

        correct_country(None, None, User.objects.all())
