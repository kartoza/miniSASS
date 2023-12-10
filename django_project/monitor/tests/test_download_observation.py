import csv
from datetime import date
from io import BytesIO, StringIO as IO

import geopandas
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.shortcuts import reverse
from rest_framework.test import APITestCase

from monitor.models import Observations, Sites
from monitor.tests.test_observations import BaseObservationsModelTest


class TestDownloadObservations(BaseObservationsModelTest):
    """
    Test download observations.
    """

    # def setUp(self):
    #     self.user = User.objects.create_user(
    #         username='testuser', password='testpassword'
    #     )
    #     self.client.force_authenticate(user=self.user)
    #
    #     self.site = Sites.objects.create(
    #         site_name='Test Site',
    #         river_name='Test River',
    #         the_geom=Point(0, 0),
    #         user=self.user
    #     )
    #
    #     self.observation = Observations.objects.create(
    #         user=self.user,
    #         flatworms=True,
    #         worms=True,
    #         leeches=False,
    #         crabs_shrimps=False,
    #         site=self.site,
    #         comment='test_comment',
    #         score=4.5,
    #         obs_date=date(2023, 12, 7),
    #         flag='clean',
    #         water_clarity=7.5,
    #         water_temp=25.0,
    #         ph=7.0,
    #         diss_oxygen=8.5,
    #         diss_oxygen_unit='mgl',
    #         elec_cond=15.0,
    #         elec_cond_unit='S/m'
    #     )
    #     self.url = reverse('download-observations', args=[self.site.gid])

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
                'Obs ID', 'User name', 'Obs Date', 'Site name', 'River name',
                'River category', 'Latitude', 'Longitude',
                'Flatworms', 'Worms', 'Leeches', 'Crabs/shrimps', 'Stoneflies',
                'Minnow mayflies', 'Other mayflies',
                'Damselflies', 'Dragonflies', 'Bugs/beetles', 'Caddisflies',
                'True flies', 'Snails', 'Score', 'Status',
                'Water clarity', 'Water temp', 'pH', 'Diss oxygen',
                'diss oxygen unit', 'Elec cond', 'Elec cond unit',
                'Comment'
            ],
            [
                str(self.observation.gid), 'testuser', '2023-12-07',
                'Test Site', 'Test River', '', '0.0', '0.0',
                'True', 'True', 'False', 'False', 'False', 'False', 'False',
                'False', 'False', 'False', 'False',
                'False', 'False', '4.50', 'Verified', '7.5', '25.0', '7.0',
                '8.50', 'mgl', '15.00', 'S/m',
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
