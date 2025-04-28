from django.test import TestCase
from unittest.mock import patch, MagicMock
from monitor.models import Sites
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point

User = get_user_model()

class SitesModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    @patch('monitor.models.Nominatim')
    def test_save_sets_country_when_not_set(self, mock_nominatim):
        # Mock the Nominatim reverse response
        mock_instance = mock_nominatim.return_value
        mock_instance.reverse.return_value.raw = {
            'address': {'country_code': 'za'}
        }

        site = Sites.objects.create(
            the_geom=Point(30.0, -25.0),  # longitude, latitude
            site_name='Test Site',
            river_name='Test River',
            user=self.user
        )

        self.assertEqual(site.country, 'ZA')  # country_code 'za' becomes 'ZA'
        mock_instance.reverse.assert_called_once()

    @patch('monitor.models.Nominatim')
    def test_save_does_not_override_existing_country(self, mock_nominatim):
        site = Sites.objects.create(
            the_geom=Point(30.0, -25.0),
            site_name='Another Site',
            river_name='Another River',
            user=self.user,
            country='ID'  # Already set manually
        )

        self.assertEqual(site.country, 'ID')
        mock_nominatim.return_value.reverse.assert_not_called()
