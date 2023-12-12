# tests.py
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse
from monitor.models import Sites, Observations, SiteImage
from monitor.serializers import SitesWithObservationsSerializer
from rest_framework.test import APIClient
from io import BytesIO
from PIL import Image

class SitesListCreateViewTestCase(TestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')

    def test_create_site_with_images(self):
        client = APIClient()
        client.force_authenticate(user=self.user)

        # Create a mock image
        image = Image.new('RGB', (100, 100))
        image_file = BytesIO()
        image.save(image_file, 'PNG')
        image_file.name = 'test_image.png'

        # Prepare the request data
        data = {
            'site_data': {
                'site_name': 'Test Site',
                'river_name': 'Test River',
                'description': 'Test Description',
                'river_cat': 'rocky',
                'longitude': 0,
                'latitude': 0,
            },
            'images': [image_file],
        }

        # Make a POST request to create a site with images
        url = reverse('sites-list-create')
        response = client.post(url, data, format='multipart')

        # Check if the response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the site and images are created
        self.assertEqual(response.data['site_name'], 'Test Site')
        self.assertEqual(response.data['river_name'], 'Test River')
        self.assertEqual(response.data['description'], 'Test Description')

        # Ensure the images are attached to the site
        site_id = response.data['gid']
        self.assertEqual(site_id, 1)  # Update with the actual site ID
        images_count = SiteImage.objects.filter(site_id=site_id).count()
        self.assertEqual(images_count, 1)

    def test_create_site_without_images(self):
        client = APIClient()
        client.force_authenticate(user=self.user)

        # Prepare the request data without images
        data = {
            'site_data': {
                'site_name': 'Test Site',
                'river_name': 'Test River',
                'description': 'Test Description',
                'river_cat': 'rocky',
                'longitude': 0,
                'latitude': 0,
            },
            'images': [],
        }

        # Make a POST request to create a site without images
        url = reverse('sites-list-create')
        response = client.post(url, data)

        # Check if the response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the site is created without images
        self.assertEqual(response.data['site_name'], 'Test Site')
        self.assertEqual(response.data['river_name'], 'Test River')
        self.assertEqual(response.data['description'], 'Test Description')

        # Ensure no images are attached to the site
        site_id = response.data['gid']
        images_count = SiteImage.objects.filter(site_id=site_id).count()
        self.assertEqual(images_count, 0)


class SiteObservationsByLocationTestCase(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a site with observations
        self.site = Sites.objects.create(
            site_name='Test Site',
            river_name='Test River',
            description='Test Description',
            river_cat='rocky',
            user=self.user,
            the_geom='SRID=4326;POINT({} {})'.format(24.84165007535725, -30.47829136066817),
        )
        Observations.objects.create(
            flatworms=True,
            worms=False,
            leeches=False,
            crabs_shrimps=True,
            stoneflies=False,
            minnow_mayflies=True,
            other_mayflies=False,
            damselflies=True,
            dragonflies=False,
            bugs_beetles=True,
            caddisflies=False,
            true_flies=False,
            snails=False,
            score="4.11",
            time_stamp="2023-11-28T14:20:42.329190+02:00",
            comment="test_observation",
            obs_date="2023-11-28",
            flag="clean",
            water_clarity="2.0",
            water_temp="1.2",
            ph="1.0",
            diss_oxygen="2.40",
            diss_oxygen_unit="%DO",
            elec_cond="2.50",
            elec_cond_unit="mS/m",
            site=self.site,
        )

    def test_get_site_observations_by_location(self):
        url = reverse('site-observations', args=[self.site.the_geom.y, self.site.the_geom.x])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = SitesWithObservationsSerializer(self.site).data
        self.assertEqual(response.data, expected_data)

    def test_get_nonexistent_site_observations_by_location(self):
        url = reverse('site-observations', args=[0.0, 0.0])  # Provide non-existent coordinates
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, [])
