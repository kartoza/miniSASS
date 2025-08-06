import os.path
import time

from django.core.management.base import BaseCommand
from django.conf import settings
from monitor.models import Sites


class Command(BaseCommand):
    help = 'Fix site countries'

    def handle(self, *args, **kwargs):
        for site in Sites.objects.all():
            # if site has no country, set it
            if not site.country:
                site.save(set_country=True)
                # set user country if empty
                if not site.user.userprofile.country:
                    site.user.userprofile.country = site.country
                    site.user.userprofile.save()
                # give 1-second sleep to avoid rate limit
                time.sleep(1)
