# tests.py
from unittest.mock import patch, Mock
from django.test import TestCase, override_settings
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.urls import reverse

from minisass.settings.test import ENABLE_GEOCODING
from monitor.models import Sites, Observations, SiteImage
from monitor.serializers import SitesWithObservationsSerializer
from rest_framework.test import APIClient
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.timezone import now, timedelta
import os
from rest_framework_simplejwt.tokens import AccessToken

class SitesListCreateViewTestCase(TestCase):

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
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')
        self.user_token = User.objects.create_superuser(
            username='testuser2', 
            password='testpassword', 
            email='test@example2.com'
        )
        self.site = Sites.objects.create(
            site_name='Test Site',
            river_name='Test River',
            the_geom=Point(0, 0),
            user=self.user
        )
        self.site1 = Sites.objects.create(
            site_name="Site 1",
            river_name="River 1",
            description="Description 1",
            river_cat="Cat 1",
            the_geom=Point(0, 0),
            user=self.user
        )
        self.site2 = Sites.objects.create(
            site_name="Site 2",
            river_name="River 2",
            description="Description 2",
            river_cat="Cat 2",
            the_geom=Point(0, 0),
            user=self.user
        )
        # Create test observations
        self.observation1 = Observations.objects.create(
            site=self.site1,
            user=self.user,
            obs_date=now().date(),
            score=50,
            comment="test_observation",
            water_clarity="2.0",
            water_temp="1.2",
            ph="1.0",
            diss_oxygen="2.40",
            diss_oxygen_unit="%DO",
            elec_cond="2.50",
            elec_cond_unit="mS/m"
        )
        self.observation2 = Observations.objects.create(
            site=self.site2,
            user=self.user,
            obs_date=now().date() - timedelta(days=10),
            score=60,
            comment="test_observation",
            water_clarity="2.0",
            water_temp="1.2",
            ph="1.0",
            diss_oxygen="2.40",
            diss_oxygen_unit="%DO",
            elec_cond="2.50",
            elec_cond_unit="mS/m"
        )
        self.token = self.generate_token_for_user(self.user_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def generate_token_for_user(self, user):
        token = AccessToken.for_user(user)
        token.set_exp(lifetime=timedelta(days=365 * 100))
        
        return str(token)

    def test_get_all_sites_with_observations(self):
        url = reverse('sites-with-observations')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        
        # Check that the 'site' key is present
        self.assertIn('site', response.data[0])
        
        # Check that the 'observations' key is present within the 'site'
        self.assertIn('observations', response.data[0]['site'])

        # Check the validity of the returned data
        self.assertEqual(response.data[0]['site']['gid'], self.site.gid)
        self.assertEqual(response.data[1]['site']['gid'], self.site1.gid)

    def test_get_sites_with_observations_filtered_by_date(self):
        url = reverse('sites-with-observations')
        start_date = (now().date() - timedelta(days=5)).isoformat()
        response = self.client.get(url, {'start_date': start_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Check structure and content of the response
        self.assertIn('site', response.data[0])
        self.assertIn('observations', response.data[0]['site'])
        self.assertEqual(response.data[0]['site']['gid'], self.site1.gid)

    def test_get_sites_with_observations_with_no_data(self):
        # Test the case where no observations match the date filter
        url = reverse('sites-with-observations')
        start_date = (now().date() + timedelta(days=1)).isoformat()
        response = self.client.get(url, {'start_date': start_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_sites_with_observations_without_token(self):
        # Remove token authentication for this request
        self.client.credentials()
        
        url = reverse('sites-with-observations')
        response = self.client.get(url)

        # Expect 401 Unauthorized without a token
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    
    def test_multiple_image_upload(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        
        # Create multiple SimpleUploadedFile instances as a simulation of image files
        image_files = [
            SimpleUploadedFile("image1.jpg", b"file_content", content_type="image/jpeg"),
            SimpleUploadedFile("image2.jpg", b"file_content", content_type="image/jpeg"),
        ]

        # Create a dictionary to simulate the request data
        request_data = {
            'images': image_files,
        }

        url = reverse('save_site_images', kwargs={'site_id': self.site.gid})

        # Use the client to perform a POST request with the provided data
        response = client.post(url, request_data, format='multipart')

        # Check if the response status code is 201 (HTTP_CREATED)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the images were saved in the SiteImage model
        saved_images = SiteImage.objects.filter(site=self.site)

        # Assert that the number of saved images matches the number of provided images
        self.assertEqual(saved_images.count(), len(image_files))

    @patch('monitor.utils.requests.get')
    @override_settings(ENABLE_GEOCODING=True)
    def test_create_site_in_ocean(self, mock_get):
        Sites.objects.all().delete()
        client = APIClient()
        client.force_authenticate(user=self.user)

        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "type": "FeatureCollection",
            "features": [],
            "totalFeatures": 0,
            "numberMatched": 0,
            "numberReturned": 0,
            "timeStamp": "2025-07-08T03:17:38.103Z",
            "crs": None,
        }
        mock_get.return_value = mock_response

        # Prepare the request data without images
        data = {
            'site_data': {
                'site_name': 'Test New Site',
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
        response = client.post(url, data, format='json')

        # Check if the response status code is 400 (HTTP_BAD_REQUEST)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Site is located in the ocean!')

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
                'longitude': 2,
                'latitude': 49,
            },
            'images': [image_file],
        }

        # Make a POST request to create a site with images
        url = reverse('sites-list-create')
        response = client.post(url, data, format='json')

        # Check if the response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the site and images are created
        self.assertEqual(response.data['site_name'], 'Test Site')
        self.assertEqual(response.data['river_name'], 'Test River')
        self.assertEqual(response.data['description'], 'Test Description')

        # Ensure the images are attached to the site
        site_id = response.data['gid']
        site = Sites.objects.get(gid=site_id)
        self.site_image_1 = SiteImage.objects.create(
            site=site,
            image=self.image_field('site_1.jpg')
        )
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
                'longitude': 2,
                'latitude': 49,
            },
            'images': [],
        }

        # Make a POST request to create a site without images
        url = reverse('sites-list-create')
        response = client.post(url, data, format='json')

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

    def test_create_site_not_authenticated(self):
        client = APIClient()
        data = {}

        # Make a POST request
        url = reverse('sites-list-create')
        response = client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_site(self):
        client = APIClient()

        # Prepare the request data without images
        data = {
            'site_name': 'Updated Site',
            'river_name': 'Updated River',
            'description': 'Updated Description',
            'river_cat': 'rocky'
        }
        # Make a POST request to update site
        url = reverse('site-retrieve-update-destroy', args=[self.site.gid])

        # test unauthorized
        response = client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # test authorize
        client.force_authenticate(user=self.user)
        response = client.patch(url, data, format='json')
        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the site is created without images
        self.assertEqual(response.data['site_name'], 'Updated Site')
        self.assertEqual(response.data['river_name'], 'Updated River')
        self.assertEqual(response.data['description'], 'Updated Description')


    def test_list_site_filter(self):
        client = APIClient()
        Sites.objects.create(
            user=self.user,
            site_name='Cape Town',
            the_geom=Point(0, 0)
        )
        Sites.objects.create(
            user=self.user,
            site_name='Limpopo',
            the_geom=Point(1, 1)
        )
        url = reverse('sites-list-create')
        response = client.get(f'{url}?site_name=mpo', format='json')
        self.assertEquals(len(response.json()), 1)
        self.assertEquals(response.json()[0]['site_name'], 'Limpopo')

    def test_list_site_filter_user(self):
        user = User.objects.create_user(username='testuser_1', password='testpassword', email='test1@example.com')
        token = self.generate_token_for_user(user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        Sites.objects.create(
            user=user,
            site_name='Cape Town',
            the_geom=Point(0, 0)
        )
        Sites.objects.create(
            user=user,
            site_name='Limpopo',
            the_geom=Point(1, 1)
        )
        Sites.objects.create(
            user=user,
            site_name='KZN',
            the_geom=Point(1, 1)
        )
        url = reverse('sites-list-create')
        response = self.client.get(f'{url}?my_sites=true&paginated=true&page_size=2', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['results']), 2)

        response = self.client.get(f'{url}?my_sites=true&paginated=true', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['results']), 3)


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
