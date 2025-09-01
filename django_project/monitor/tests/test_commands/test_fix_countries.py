import time
from unittest.mock import patch, Mock
from django.test import TestCase, override_settings
from django.core.management import call_command
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point

from minisass.settings.test import ENABLE_GEOCODING
from monitor.models import Sites
from minisass_authentication.models import UserProfile


class FixCountriesCommandTest(TestCase):

    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='test@example.com'
        )
        self.user_profile = self.user.userprofile

        # Create sites without country
        self.site1 = Sites.objects.create(
            site_name='Test Site 1',
            river_name='Test River 1',
            the_geom=Point(30.0, -25.0),
            user=self.user,
            country=None  # No country set
        )

        self.site2 = Sites.objects.create(
            site_name='Test Site 2',
            river_name='Test River 2',
            the_geom=Point(-28.612559, 25.220976),
            user=self.user,
            country=None  # No country set
        )

        # Create a site that already has a country
        self.site3 = Sites.objects.create(
            site_name='Test Site 3',
            river_name='Test River 3',
            the_geom=Point(0, 0),
            user=self.user,
            country='US'  # Already has country
        )

    @override_settings(ENABLE_GEOCODING=True)
    @patch('monitor.utils.requests.get')
    @patch('time.sleep')
    def test_fix_countries_command_skips_sites_with_existing_country(self, mock_sleep, mock_get):
        # Set all sites to have countries
        self.site1.country = 'ZA'
        self.site1.save()
        self.site2.country = 'US'
        self.site2.save()

        # Run the command
        call_command('fix_countries')

        # Assert that no API calls were made since all sites have countries
        mock_get.assert_not_called()
        mock_sleep.assert_not_called()

    @patch('monitor.utils.requests.get')
    @patch('time.sleep')  # Mock sleep to speed up tests
    @override_settings(ENABLE_GEOCODING=True)
    def test_fix_countries_command_sets_country_for_sites_without_country(self, mock_sleep, mock_get):
        # Mock the API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "id": "world.234",
                    "geometry": None,
                    "properties": {"ADMIN": "South Africa", "ISO_A2": "ZA"},
                    "bbox": [29.321, -11.7313, 40.4369, -1.0026],
                }
            ],
            "totalFeatures": 1,
            "numberMatched": 1,
            "numberReturned": 1,
            "timeStamp": "2025-07-08T03:17:38.103Z",
            "crs": None,
        }
        mock_get.return_value = mock_response

        # Run the command
        call_command('fix_countries')

        # Refresh objects from database
        self.site1.refresh_from_db()
        self.site2.refresh_from_db()
        self.site3.refresh_from_db()
        self.user_profile.refresh_from_db()

        # Assert that sites without country now have country set
        self.assertEqual(self.site1.country, 'ZA')
        self.assertEqual(self.site2.country, 'ZA')

        # Assert that site with existing country is unchanged
        self.assertEqual(self.site3.country, 'US')

        # Assert that expert user's profile country is updated
        self.assertEqual(self.user_profile.country, 'ZA')

    @patch('monitor.utils.requests.get')
    @patch('time.sleep')
    def test_fix_countries_command_updates_user_profile_without_country(self, mock_sleep, mock_get):
        # Create a user
        non_expert_user = User.objects.create_user(
            username='nonexpert',
            password='testpassword',
            email='nonexpert@example.com'
        )
        non_expert_profile = non_expert_user.userprofile

        # Create site for non-expert user
        site_non_expert = Sites.objects.create(
            site_name='Non Expert Site',
            river_name='Non Expert River',
            the_geom=Point(30.0, -25.0),
            user=non_expert_user,
            country=None
        )

        # Mock the API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"ISO_A2": "ZA"},
                }
            ],
            "totalFeatures": 1,
            "numberMatched": 1,
            "numberReturned": 1,
            "timeStamp": "2025-07-08T03:17:38.103Z",
            "crs": None
        }
        mock_get.return_value = mock_response

        with override_settings(ENABLE_GEOCODING=True):
            # Run the command
            call_command('fix_countries')

            # Refresh objects
            site_non_expert.refresh_from_db()
            non_expert_profile.refresh_from_db()

            # Assert site country is set
            self.assertEqual(site_non_expert.country, 'ZA')

            # Assert user profile country is updated
            self.assertEquals(non_expert_profile.country, 'ZA')

    @patch('monitor.utils.requests.get')
    @patch('time.sleep')
    def test_fix_countries_command_updates_user_without_profile(self, mock_sleep, mock_get):
        # Create a user
        non_expert_user = User.objects.create_user(
            username='nonexpert',
            password='testpassword',
            email='nonexpert@example.com'
        )
        non_expert_user.userprofile.delete()

        # Create site for non-expert user
        site_non_expert = Sites.objects.create(
            site_name='Non Expert Site',
            river_name='Non Expert River',
            the_geom=Point(30.0, -25.0),
            user=non_expert_user,
            country=None
        )

        # Mock the API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"ISO_A2": "ZA"},
                }
            ],
            "totalFeatures": 1,
            "numberMatched": 1,
            "numberReturned": 1,
            "timeStamp": "2025-07-08T03:17:38.103Z",
            "crs": None
        }
        mock_get.return_value = mock_response

        with override_settings(ENABLE_GEOCODING=True):
            # Run the command
            call_command('fix_countries')

            # Refresh objects
            site_non_expert.refresh_from_db()
            non_expert_user.refresh_from_db()

            # Assert site country is set
            self.assertEqual(site_non_expert.country, 'ZA')

            # Assert user profile country is updated
            self.assertEquals(non_expert_user.userprofile.country, 'ZA')

    @patch('monitor.utils.requests.get')
    @patch('time.sleep')
    def test_fix_countries_command_not_update_user_profile_with_country(self, mock_sleep, mock_get):
        # Create a user
        non_expert_user = User.objects.create_user(
            username='nonexpert',
            password='testpassword',
            email='nonexpert@example.com',
        )
        non_expert_profile = non_expert_user.userprofile
        non_expert_profile.country = 'ID'
        non_expert_profile.save()

        # Create site for non-expert user
        site_non_expert = Sites.objects.create(
            site_name='Non Expert Site',
            river_name='Non Expert River',
            the_geom=Point(30.0, -25.0),
            user=non_expert_user,
            country=None
        )

        # Mock the API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"ISO_A2": "ZA"},
                }
            ],
            "totalFeatures": 1,
            "numberMatched": 1,
            "numberReturned": 1,
            "timeStamp": "2025-07-08T03:17:38.103Z",
            "crs": None
        }
        mock_get.return_value = mock_response

        with override_settings(ENABLE_GEOCODING=True):
            # Run the command
            call_command('fix_countries')

            # Refresh objects
            site_non_expert.refresh_from_db()
            non_expert_profile.refresh_from_db()

            # Assert site country is set
            self.assertEqual(site_non_expert.country, 'ZA')

            # Assert user profile country is NOT updated
            self.assertEquals(non_expert_profile.country, 'ID')