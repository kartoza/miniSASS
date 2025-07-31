from django.test import TestCase
from unittest.mock import patch, MagicMock, Mock
from monitor.models import Sites
from django.test import override_settings
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point

User = get_user_model()

@override_settings(ENABLE_GEOCODING=True)
class SitesModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    @patch('monitor.utils.requests.get')
    def test_save_sets_country_when_not_set(self, mock_get):
        # Mock the requests.get method to return a mock response
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

        site = Sites.objects.create(
            the_geom=Point(30.0, -25.0),  # longitude, latitude
            site_name='Test Site',
            river_name='Test River',
            user=self.user
        )

        self.assertEqual(site.country, 'ZA')  # country_code 'za' becomes 'ZA'
        mock_get.assert_called_once()

    @patch('monitor.utils.requests.get')
    def test_save_same_geom_does_not_override_existing_country(self, mock_get):
        site = Sites.objects.create(
            the_geom=Point(30.0, -25.0),
            site_name='Another Site',
            river_name='Another River',
            user=self.user,
            country='ID'
        )

        self.assertEqual(site.country, 'ID')
        mock_get.assert_not_called()

    @patch('monitor.utils.requests.get')
    def test_update_geom_does_not_override_existing_country(self, mock_get):
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

        site = Sites.objects.create(
            the_geom=Point(30.0, -25.0),
            site_name='Another Site',
            river_name='Another River',
            user=self.user,
            country='ID'
        )
        site.the_geom = Point(-28.612559, 25.220976)
        site.save()

        self.assertEqual(site.country, 'ZA')
        mock_get.assert_called_once()
