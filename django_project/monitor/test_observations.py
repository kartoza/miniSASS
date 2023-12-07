import csv
from datetime import date
from io import BytesIO
from io import StringIO as IO

import geopandas
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.shortcuts import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from monitor.models import Observations, Sites


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


class TestDownloadObservations(APITestCase):
    """
    Test download observations.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        self.site = Sites.objects.create(
            site_name='Test Site',
            river_name='Test River',
            the_geom=Point(0, 0),
            user=self.user
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
            obs_date=date(2023, 12, 7),
            flag='clean',
            water_clarity=7.5,
            water_temp=25.0,
            ph=7.0,
            diss_oxygen=8.5,
            diss_oxygen_unit='mgl',
            elec_cond=15.0,
            elec_cond_unit='S/m'
        )
        self.url = reverse('download-observations', args=[self.site.gid])

    def test_download_csv(self):
        """
        Test download observations as CSV.
        """
        response = self.client.get(
            self.url,
            {
                'type': 'csv',
                'start_date': '2023-12-03',
                'end_date': '2023-12-07'
            }
        )
        content = response.content.decode('utf-8-sig')
        cvs_reader = csv.reader(IO(content))
        body = list(cvs_reader)

        expected_response = [
            [
                'Obs ID', 'User name', 'Obs Date', 'Site name', 'River name', 'River category', 'Latitude', 'Longitude',
                'Flatworms', 'Worms', 'Leeches', 'Crabs/shrimps', 'Stoneflies', 'Minnow mayflies', 'Other mayflies',
                'Damselflies', 'Dragonflies', 'Bugs/beetles', 'Caddisflies', 'True flies', 'Snails', 'Score', 'Status',
                'Water clarity', 'Water temp', 'pH', 'Diss oxygen', 'diss oxygen unit', 'Elec cond', 'Elec cond unit',
                'Comment'
            ],
            [
                str(self.observation.gid), 'testuser', '2023-12-07', 'Test Site', 'Test River', '', '0.0', '0.0',
                'True', 'True', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False',
                'False', 'False', '4.50', 'Verified', '7.5', '25.0', '7.0', '8.50', 'mgl', '15.00', 'S/m',
                'test_comment'
            ]
        ]

        self.assertEquals(
            body,
            expected_response
        )

    def test_download_geopackage(self):
        """
        Test download observations as GeoPackage.
        """
        response = self.client.get(
            self.url,
            {
                'type': 'geopackage',
                'start_date': '2023-12-03',
                'end_date': '2023-12-07'
            }
        )
        file = BytesIO()
        file.write(response.content)
        file.seek(0)
        df = geopandas.read_file(file)
        self.assertEquals(
            len(df.index),
            1
        )
