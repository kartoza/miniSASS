from django.test import TestCase
from django.contrib.auth.models import User
from monitor.models import Observations, Sites
from datetime import date
from rest_framework import status
from django.contrib.gis.geos import Point
from django.urls import reverse
from rest_framework.test import APIClient
import json

class ObservationsModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.site = Sites.objects.create(
            site_name='Test Site',
            river_name='Test River',
            the_geom=Point(0, 0),
            user=self.user
        )

        Observations.objects.create(
            user=self.user,
            flatworms=True,
            worms=True,
            leeches=False,
            crabs_shrimps=False,
            site=self.site,
            comment='test_comment',
            score=4.5,
            obs_date=date.today(),
            flag='clean',
            water_clarity=7.5,
            water_temp=25.0,
            ph=7.0,
            diss_oxygen=8.5,
            diss_oxygen_unit='mgl',
            elec_cond=15.0,
            elec_cond_unit='S/m'
        )

    def test_observation_str_representation(self):
        observation = Observations.objects.get(flatworms=True)
        self.assertEqual(str(observation), f"{observation.obs_date}: {observation.site.site_name}")

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
        observation = Observations.objects.first()
        url = reverse('observation-details', kwargs={'pk': observation.gid})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Ensure the response contains the necessary fields
        self.assertContains(response, 'sitename')
        self.assertContains(response, 'rivername')
        self.assertContains(response, 'sitedescription')
        self.assertContains(response, 'rivercategory')
        self.assertContains(response, 'longitude')
        self.assertContains(response, 'latitude')
        self.assertContains(response, 'date')
        self.assertContains(response, 'collectorsname')
        self.assertContains(response, 'organisationtype')
        self.assertContains(response, 'score')
        self.assertContains(response, 'flatworms')


    def test_observation_delete_view(self):
        observation = Observations.objects.first()
        url = reverse('observation-retrieve-update-delete', kwargs={'pk': observation.gid})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Check if the object is actually deleted from the database
        with self.assertRaises(Observations.DoesNotExist):
            Observations.objects.get(gid=observation.gid)
