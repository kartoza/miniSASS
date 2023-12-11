import csv
import os
from io import BytesIO, StringIO as IO
from zipfile import ZipFile

import geopandas
from django.conf import settings
from django.shortcuts import reverse

from monitor.tests.test_observations import BaseObservationsModelTest


class TestDownloadObservations(BaseObservationsModelTest):
    """
    Test download observations.
    """

    def setUp(self):
        super().setUp()
        self.url = reverse('download-observations', args=[self.site.gid])

    def test_download_csv_without_images(self):
        """
        Test download observations as CSV without images.
        """
        response = self.client.get(
            self.url,
            {
                'type': 'csv',
                'start_date': '2023-12-03',
                'end_date': '2023-12-07',
                'include_image': False
            }
        )
        content = response.content.decode('utf-8')
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
                str(self.observation.gid), 'testuser', '2023-12-03', 'Test Site', 'Test River', '', '0.0', '0.0',
                'True', 'True', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False',
                'False', 'False', '4.50', 'Verified', '7.5', '25.0', '7.0', '8.50', 'mgl', '15.00', 'S/m',
                'test_comment'
            ],
            [
                str(self.observation_2.gid), 'testuser', '2023-12-07', 'Test Site', 'Test River', '', '0.0', '0.0',
                'False', 'True', 'True', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False',
                'False', 'False', '2.00', 'Verified', '3.0', '2.0', '1.0', '1.50', 'mgl', '1.00', 'S/m',
                'test_comment'
            ]
        ]

        self.assertEquals(
            body,
            expected_response
        )

    def test_download_csv_with_images(self):
        """
        Test download observations as CSV with.
        """
        response = self.client.get(
            self.url,
            {
                'type': 'csv',
                'start_date': '2023-12-03',
                'end_date': '2023-12-07',
            }
        )
        content = response.content

        zip_file_path = os.path.join(settings.MEDIA_ROOT, 'test_download_csv_with_images.zip')

        with open(zip_file_path, 'wb') as f:
            f.write(content)

        with ZipFile(zip_file_path) as zf:
            files = [
                'testuser_exports/observations.csv',
                'testuser_exports/images/observations/2023-12-03/Flatworms.jpg',
                'testuser_exports/images/observations/2023-12-03/Worms.jpg',
                'testuser_exports/images/observations/2023-12-07/Leeches.jpg'
            ]
            for file in files:
                self.assertTrue(file in zf.namelist())

    def test_download_geopackage_without_images(self):
        """
        Test download observations as GeoPackage.
        """
        response = self.client.get(
            self.url,
            {
                'type': 'gpkg',
                'start_date': '2023-12-03',
                'end_date': '2023-12-07',
                'include_image': False
            }
        )
        file = BytesIO()
        file.write(response.content)
        file.seek(0)
        df = geopandas.read_file(file)
        self.assertEquals(
            len(df.index),
            2
        )

    def test_download_geopackage_with_images(self):
        """
        Test download observations as GeoPackage.
        """
        response = self.client.get(
            self.url,
            {
                'type': 'gpkg',
                'start_date': '2023-12-03',
                'end_date': '2023-12-07',
                'include_image': True
            }
        )
        zip_file_path = os.path.join(settings.MEDIA_ROOT, 'test_download_geopackage_with_images.zip')

        with open(zip_file_path, 'wb') as f:
            f.write(response.content)

        with ZipFile(zip_file_path) as zf:
            files = [
                'testuser_exports/observations.gpkg',
                'testuser_exports/images/observations/2023-12-03/Flatworms.jpg',
                'testuser_exports/images/observations/2023-12-03/Worms.jpg',
                'testuser_exports/images/observations/2023-12-07/Leeches.jpg'
            ]
            for file in files:
                self.assertTrue(file in zf.namelist())
