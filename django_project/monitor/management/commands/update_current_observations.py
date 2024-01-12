import os.path

from django.core.management.base import BaseCommand
from django.conf import settings
from monitor.models import Observations, ObservationPestImage, SiteImage, site_image_path
from monitor.utils import send_to_ai_bucket


class Command(BaseCommand):
    help = 'Move images location and update path to be groupped by flag and group'

    def handle(self, *args, **kwargs):
        for observation in Observations.objects.all():
            if observation.user.userprofile.is_expert:
                observation.is_validated = True
                observation.save()

        for image in ObservationPestImage.objects.all():
            if image.observation.user.userprofile.is_expert:
                image.valid = True
            image.update_image_path()
            image.save()
            send_to_ai_bucket(image)

        for image in SiteImage.objects.all():
            initial_path = image.image.path
            filename = os.path.basename(image.image.path)

            new_name = site_image_path(image, filename)
            new_path = os.path.join(settings.MINIO_ROOT, new_name)

            # Create dir if necessary and move file
            if not os.path.exists(os.path.dirname(new_path)):
                os.makedirs(os.path.dirname(new_path))

            os.rename(initial_path, new_path)
            image.image.name = new_name
            image.save()
