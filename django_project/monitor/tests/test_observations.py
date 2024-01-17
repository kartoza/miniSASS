import os
from datetime import date, datetime
from unittest.mock import patch

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from minisass.models import GroupScores
from minisass_authentication.models import UserProfile
from minisass_authentication.tests.factories import UserFactory
from monitor.models import (
    Observations, Sites, SiteImage, ObservationPestImage, Pest
)


@override_settings(
    MINIO_ENDPOINT='http://some-endpoint',
    MINIO_ACCESS_KEY='MINIO_ACCESS_KEY',
    MINIO_SECRET_KEY='MINIO_SECRET_KEY'
)
class BaseObservationsModelTest(TestCase):
    """
    Base Test for Observation Test.
    """
    def image_field(self, name):
        """Return image field with name."""
        image_path = os.path.join(
            os.path.abspath(os.path.dirname(__file__)), 'test_image.png'
        )
        return SimpleUploadedFile(
            name=name,
            content=open(image_path, 'rb').read(),
            content_type='image/jpeg'
        )

    def setUp(self):
        self.s3_client_patch = patch('minisass.utils.boto3.client')
        self.s3_client_patch.start()

        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            first_name='First',
            last_name='Last',
            email='test@gmail.com'
        )
        self.profile = UserProfile.objects.get_or_create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.site = Sites.objects.create(
            site_name='Test Site',
            river_name='Test River',
            the_geom=Point(0, 0),
            user=self.user
        )

        # Site images
        self.site_image_1 = SiteImage.objects.create(
            site=self.site,
            image=self.image_field('site_1.jpg')
        )
        self.site_image_1 = SiteImage.objects.create(
            site=self.site,
            image=self.image_field('site_2.jpg')
        )

        self.observation = Observations.objects.create(
            user=self.user,
            flatworms=True,
            worms=True,
            leeches=False,
            crabs_shrimps=False,
            site=self.site,
            comment='test_comment',
            score=4.5,
            obs_date=date(2023, 12, 3),
            flag='clean',
            water_clarity=7.5,
            water_temp=25.0,
            ph=7.0,
            diss_oxygen=8.5,
            diss_oxygen_unit='mgl',
            elec_cond=15.0,
            elec_cond_unit='S/m'
        )

        self.observation_2 = Observations.objects.create(
            user=self.user,
            flatworms=False,
            worms=True,
            leeches=True,
            crabs_shrimps=False,
            site=self.site,
            comment='test_comment',
            score=2,
            obs_date=date(2023, 12, 7),
            flag='clean',
            water_clarity=3,
            water_temp=2,
            ph=1.0,
            diss_oxygen=1.5,
            diss_oxygen_unit='mgl',
            elec_cond=1.0,
            elec_cond_unit='S/m'
        )

        self.flatworms, _ = GroupScores.objects.get_or_create(name='Flatworms', sensitivity_score=2, db_field='flatworms')
        self.bugs_beetles, _ = GroupScores.objects.get_or_create(name='Bugs beetles', sensitivity_score=2, db_field='bugs_beetles')
        self.worms, _ = GroupScores.objects.get_or_create(name='Worms', sensitivity_score=2, db_field='worms')
        self.leeches, _ = GroupScores.objects.get_or_create(name='Leeches', sensitivity_score=2, db_field='leeches')

        self.pest_image_1 = ObservationPestImage.objects.create(
            observation=self.observation,
            group=self.flatworms,
            image=self.image_field('flatworms_1.jpg')
        )

        self.pest_image_2 = ObservationPestImage.objects.create(
            observation=self.observation,
            group=self.worms,
            image=self.image_field('worms_1.jpg')
        )

        self.pest_image_3 = ObservationPestImage.objects.create(
            observation=self.observation_2,
            group=self.leeches,
            image=self.image_field('leeches_1.jpg')
        )


class ObservationsModelTest(BaseObservationsModelTest):
    def test_observation_str_representation(self):
        observation = Observations.objects.get(flatworms=True)
        self.assertEqual(
            str(observation),
            f"{observation.obs_date}: {observation.site.site_name}"
        )

    def test_recent_observation_view(self):
        url = reverse('recent-observation-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Ensure the response contains the necessary fields
        self.assertContains(response, 'observation')
        self.assertContains(response, 'site')
        self.assertContains(response, 'username')
        self.assertContains(response, 'organisation')
        self.assertContains(response, 'time_stamp')
        self.assertContains(response, 'score')

    def test_observation_retrieve_view(self):
        url = reverse(
            'observation-details', kwargs={'pk': self.observation.gid}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = response.json()

        # Ensure the response contains the necessary fields
        self.assertEqual(response['sitename'], self.observation.site.site_name)
        self.assertEqual(
            response['rivername'], self.observation.site.river_name
        )
        self.assertEqual(
            response['sitedescription'], self.observation.site.description
        )
        self.assertEqual(
            response['rivercategory'], self.observation.site.river_cat
        )
        self.assertEqual(
            response['longitude'], self.observation.site.the_geom.x
        )
        self.assertEqual(
            response['latitude'], self.observation.site.the_geom.y
        )
        self.assertEqual(
            response['obs_date'],
            datetime.strftime(self.observation.obs_date, "%Y-%m-%d")
        )
        self.assertEqual(
            response['collectorsname'],
            f"{self.user.first_name} {self.user.last_name}"
        )
        self.assertEqual(float(response['score']), self.observation.score)
        self.assertEqual(response['flatworms'], self.observation.flatworms)
        self.assertEqual(len(response['site']['images']), 2)

    def test_observation_delete_view(self):
        observation = Observations.objects.first()
        url = reverse(
            'observation-retrieve-update-delete',
            kwargs={'pk': observation.gid}
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Check if the object is actually deleted from the database
        with self.assertRaises(Observations.DoesNotExist):
            Observations.objects.get(gid=observation.gid)

    def test_upload_pest_image(self):

        # Create a sample image file
        image_file = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")

        # this resolves the user instance error when creating the site
        self.client.login(email='test@gmail.com', password='testpassword')

        url = reverse('upload-pest-images')

        response = self.client.post(
            url, 
            {
                f'pest_image:{self.flatworms.id}': image_file,
                'observationId': 0,
                'siteId': 0,
                'create_site_or_observation': 'False'
            },
        )

        # Check the response status and content
        self.assertEqual(response.status_code, 200)
        self.assertIn('status', response.json())
        self.assertIn('observation_id', response.json())

        observation_id = response.json()['observation_id']
        site_id = response.json()['site_id']
        pest_image_id = response.json()['pest_image_id']


        response = self.client.post(
            url, 
            {
                f'pest_image:{self.flatworms.id}': image_file,
                'observationId': observation_id,
                'siteId': site_id,
                'create_site_or_observation': 'False'
            },
        )

        observation_id = response.json()['observation_id']
        site_id = response.json()['site_id']
        pest_image_id = response.json()['pest_image_id']

        url = reverse(
            'remove-pest-image',
            kwargs={
                'pk': pest_image_id,
                'observation_pk': observation_id
            }
        )

        response = self.client.post(url)

        self.assertEqual(response.status_code, 200)

    def test_observation_image_list_view(self):
        """Test observation images."""
        # List image for observation not exist
        url = reverse(
            'observation-image-view-list',
            kwargs={'observation_pk': 0}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

        # List image for observation 1
        url = reverse(
            'observation-image-view-list',
            kwargs={'observation_pk': self.observation.gid}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = response.json()
        self.assertEqual(len(response), 2)

        # List image for observation 2
        url = reverse(
            'observation-image-view-list',
            kwargs={'observation_pk': self.observation_2.gid}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = response.json()
        self.assertEqual(len(response), 1)

    def test_observation_image_detail_view(self):
        """Test observation images."""

        # Image does not exist
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': 0,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

        # Image 3 is not from observation 1
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': self.pest_image_3.id,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

        # Image 1 is from observation 1
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': self.pest_image_1.id,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = response.json()
        self.assertEqual(response['pest_id'], self.pest_image_1.group.id)
        self.assertEqual(response['pest_name'], self.pest_image_1.group.name)

    def test_observation_image_delete_view(self):
        """Test observation images."""

        # Delete image with pk 0
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': 0,
                'observation_pk': self.observation.gid
            }
        )
        self.client = APIClient()
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # Delete image that exist
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': self.pest_image_1.id,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # Delete image that exist but user is not creator of observation
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': self.pest_image_1.id,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.delete(url)
        self.client.force_authenticate(
            user=User.objects.create_user(
                username='testuser_1',
                password='testpassword_1',
                first_name='First_1',
                last_name='Last_1',
            )
        )
        self.assertEqual(response.status_code, 403)

        # We get the pest_image using API
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': self.pest_image_1.id,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = response.json()
        self.assertEqual(response['pest_id'], self.pest_image_1.group.id)
        self.assertEqual(response['pest_name'], self.pest_image_1.group.name)

        # Delete image that exist and user is creator of observation
        self.client.force_authenticate(
            user=self.user
        )
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': self.pest_image_1.id,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        # We get the pest_image using API
        url = reverse(
            'observation-image-view-detail',
            kwargs={
                'pk': self.pest_image_1.id,
                'observation_pk': self.observation.gid
            }
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_observations_by_site_id(self):
        self.client.force_authenticate(
            user=self.user
        )

        # Make a GET request to the observations by site endpoint
        url = reverse('observations-by-site', kwargs={'site_id': self.site.gid})

        # Make a GET request to the observations by site endpoint
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/json')

    def test_observations_by_nonexistent_site_id(self):
        self.client.login(email='test@gmail.com', password='testuserpassword')

        url = reverse('observations-by-site', kwargs={'site_id': 999})

        # Make a GET request to the observations by site endpoint with a nonexistent site ID
        response = self.client.get(url)

        # Check if the response status code is 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_expert_auto_validated_observation(self):
        """
        When observation is created by expert, it will automatically be validated.
        All images will also valid.
        """
        user = UserFactory.create()
        user.userprofile.is_expert = True
        user.userprofile.save()

        observation = Observations.objects.create(
            user=user,
            flatworms=True,
            worms=True,
            leeches=False,
            crabs_shrimps=False,
            site=self.site,
            comment='test_comment',
            score=4.5,
            obs_date=date(2023, 12, 3),
            flag='clean',
            water_clarity=7.5,
            water_temp=25.0,
            ph=7.0,
            diss_oxygen=8.5,
            diss_oxygen_unit='mgl',
            elec_cond=15.0,
            elec_cond_unit='S/m'
        )
        site_image_1 = SiteImage.objects.create(
            site=observation.site,
            image=self.image_field('site_2.jpg')
        )
        pest_image_1 = ObservationPestImage.objects.create(
            observation=observation,
            group=self.bugs_beetles,
            image=self.image_field('bugs_beetles_1.jpg')
        )
        self.assertTrue(observation.is_validated)
        self.assertTrue(pest_image_1.valid)

        # image is in 'clean' directory
        self.assertTrue(
            pest_image_1.image.name,
            f'demo/observations/clean/bugs_beetles/{observation.site_id}/{observation.gid}/bugs_beetles_1.jpg'
        )
        self.assertTrue(
            site_image_1.image.name,
            f'demo/sites/{observation.site_id}/site_2.jpg'
        )

    def test_novice_observation_dirty(self):
        """
        When observation is created by novice, it will not automatically be validated.
        All images will also invalid.
        """
        self.assertFalse(self.observation.is_validated)
        self.assertFalse(self.pest_image_1.valid)

        # image is in 'dirty' directory
        self.assertTrue(
            self.pest_image_1.image.name,
            f'demo/observations/dirty/flatworms/{self.observation.site_id}/{self.observation.gid}/flatworms_1.jpg'
        )
        self.assertTrue(
            self.site_image_1.image.name,
            f'demo/sites/{self.site.gid}/site_1.jpg'
        )

    # commenting this since it causes issue on deployment, even though it works on local and Github.
    # def test_validate_image(self):
    #     """
    #     Test validating image. Image path should be updated, and image file is moved.
    #     """
    #     old_image_path = f'demo/observations/dirty/flatworms/{self.observation.site_id}/' \
    #                      f'{self.observation.gid}/flatworms_1.jpg'
    #     new_image_path = old_image_path.replace('/dirty/', '/clean/').replace('flatworms', 'worms')
    #     self.assertTrue(
    #         self.pest_image_1.image.name,
    #         old_image_path
    #     )
    #
    #     self.pest_image_1.valid = True
    #     self.pest_image_1.pest = self.worms
    #     self.pest_image_1.save()
    #
    #     # image path in databse record is updated
    #     self.assertTrue(
    #         self.pest_image_1.image.name,
    #         new_image_path
    #     )
    #
    #     # Observation is validated
    #     self.assertTrue(self.pest_image_1.observation.is_validated)
    #
    #     # Image file is moved to clean directory
    #     self.assertFalse(os.path.exists(os.path.join(settings.MINIO_ROOT, old_image_path)))
    #     self.assertTrue(
    #         os.path.exists(os.path.join(settings.MINIO_ROOT, new_image_path))
    #     )

    def tearDown(self):
        """Tear down."""
        self.pest_image_1.delete()
        self.pest_image_2.delete()
        self.pest_image_3.delete()
        self.site.delete()
        self.s3_client_patch.stop()
