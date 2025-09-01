import os.path
import time
import logging

from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import User
from monitor.models import Sites
from minisass_authentication.admin.minisass import correct_country

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
class Command(BaseCommand):
    help = 'Fix site and user countries'

    def handle(self, *args, **kwargs):
        for site in Sites.objects.all():
            # if site has no country, set it
            if not site.country:
                logger.info('Fixing Site %s', site.gid)
                try:
                    site.save(set_country=True)
                except Exception as e:
                    logger.error('Error fixing Site %s: %s', site.gid, e)
                # set user country if empty
                if not site.user.userprofile.country:
                    site.user.userprofile.country = site.country
                    site.user.userprofile.save()
                logger.info('Site %s fixed successfully', site.gid)

        correct_country(None, None, User.objects.all().filter(email='zakki@kartoza.com'))

        logger.info('Finished fixing countries')