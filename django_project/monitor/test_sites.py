# tests.py
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse
from monitor.models import Sites, Observations
from monitor.serializers import SitesWithObservationsSerializer

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
