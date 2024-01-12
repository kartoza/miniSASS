import os

from django.conf import settings
from django.core.management import call_command

from minisass.utils import get_path_string
from monitor.models import (
    SiteImage, ObservationPestImage
)
from monitor.tests.test_observations import BaseObservationsModelTest


def old_site_image_path(instance, filename):
    return os.path.join(
        settings.MINIO_BUCKET,
        f'{instance.site_id}',
        filename
    )


def old_observation_pest_image_path(instance, filename):
    return os.path.join(
        settings.MINIO_BUCKET,
        f'{instance.observation.site_id}',
        f'{instance.observation_id}',
        filename
    )


class TestUpdateObservationsCommand(BaseObservationsModelTest):
    """
    Test update_current_observations command, which is used to update observation and site
    images path formating.
    """

    def setUp(self):
        super(TestUpdateObservationsCommand, self).setUp()
        for pest_image in ObservationPestImage.objects.all():
            initial_path = pest_image.image.path
            filename = os.path.basename(pest_image.image.path)

            new_name = old_observation_pest_image_path(pest_image, filename)
            new_path = os.path.join(settings.MINIO_ROOT, new_name)

            # Create dir if necessary and move file
            if not os.path.exists(os.path.dirname(new_path)):
                os.makedirs(os.path.dirname(new_path))

            os.rename(initial_path, new_path)
            pest_image.image.name = new_name
            pest_image.save()
            pest_image.observation.flag = 'dirty'
            pest_image.observation.save()

        for site_image in SiteImage.objects.all():
            initial_path = site_image.image.path
            filename = os.path.basename(site_image.image.path)

            new_name = old_site_image_path(site_image, filename)
            new_path = os.path.join(settings.MINIO_ROOT, new_name)

            # Create dir if necessary and move file
            if not os.path.exists(os.path.dirname(new_path)):
                os.makedirs(os.path.dirname(new_path))

            os.rename(initial_path, new_path)
            site_image.image.name = new_name
            site_image.save()

    def test_run_command(self):
        # Check image path before running commands
        for pest_image in ObservationPestImage.objects.all():
            path = f'/home/web/minio/demo/{pest_image.observation.site_id}/{pest_image.observation_id}/' \
                   f'{get_path_string(pest_image.pest.name)}_1.jpg'
            # use startswith to also check when we plan to move file
            # to: /home/web/minio/demo/16/site_1.jpg
            # But the file is moved to /home/web/minio/demo/16/site_1_MOsfx9W.jpg due to duplication
            self.assertTrue(
                pest_image.image.path.startswith(path)
            )
            self.assertTrue(os.path.exists(path))

        for idx, site_image in enumerate(SiteImage.objects.all()):
            path = f'/home/web/minio/demo/{site_image.site_id}/site_{idx+1}.jpg'

            # use startswith to also check when we plan to move file
            # to: /home/web/minio/demo/16/site_1.jpg
            # But the file is moved to /home/web/minio/demo/16/site_1_MOsfx9W.jpg due to duplication
            self.assertTrue(
                site_image.image.path.startswith(path)
            )
            self.assertTrue(os.path.exists(path))

        # Run command
        call_command('update_current_observations')

        for pest_image in ObservationPestImage.objects.all():
            old_path = f'/home/web/minio/demo/{pest_image.observation.site_id}/{pest_image.observation_id}/' \
                       f'{get_path_string(pest_image.pest.name)}_1.jpg'
            new_path = f'/home/web/minio/demo/observations/dirty/{get_path_string(pest_image.pest.name)}/' \
                       f'{self.observation.site_id}/{pest_image.observation.gid}/{get_path_string(pest_image.pest.name)}_1.jpg'

            # check record is updated
            # use startswith to also check when we plan to move file
            # to: /home/web/minio/demo/16/site_1.jpg
            # But the file is moved to /home/web/minio/demo/16/site_1_MOsfx9W.jpg due to duplication
            self.assertTrue(
                pest_image.image.path.startswith(new_path)
            )

            # Check invalid
            self.assertFalse(pest_image.observation.is_validated)
            self.assertFalse(pest_image.valid)

            # check image has been moved
            self.assertFalse(os.path.exists(old_path))
            self.assertTrue(os.path.exists(new_path))

        for idx, site_image in enumerate(SiteImage.objects.all()):
            old_path = f'/home/web/minio/demo/{site_image.site_id}/site_{idx+1}.jpg'
            new_path = f'/home/web/minio/demo/sites/{site_image.site_id}/site_{idx+1}.jpg'

            # check record is updated
            # use startswith to also check when we plan to move file
            # to: /home/web/minio/demo/16/site_1.jpg
            # But the file is moved to /home/web/minio/demo/16/site_1_MOsfx9W.jpg due to duplication
            self.assertTrue(
                site_image.image.path.startswith(new_path)
            )

            # check image has been moved
            self.assertFalse(os.path.exists(old_path))
            self.assertTrue(os.path.exists(new_path))
