import csv
import io
from django.contrib.admin.sites import site as admin_site
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.test import TestCase
from django.urls import reverse
from monitor.models import Sites, Observations

User = get_user_model()

class AdminCSVDownloadTest(TestCase):
    """
    Test the Sites admin CSV download.
    """

    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin@example.com',
            email='admin@example.com',
            password='password'
        )
        self.admin_user.userprofile.country = 'ZA'
        self.admin_user.userprofile.save()
        self.client.login(email='admin@example.com', password='password')

        self.site1 = Sites.objects.create(
            site_name="Site A",
            river_name="Big River",
            description="Has some, commas",
            river_cat="rocky",
            the_geom="POINT(110.123 7.456)",
            user=self.admin_user
        )

        self.site2 = Sites.objects.create(
            site_name="Site B",
            river_name="Little River",
            description="Clean description",
            river_cat="sandy",
            the_geom="POINT(111.000 8.000)",
            user=self.admin_user,
            country=''
        )

    def test_csv_download_action(self):
        """
        Test download action.
        """

        # get the model admin path
        url = reverse('admin:monitor_sites_changelist')

        # select both sites and trigger CSV download
        data = {
            'action': 'download_selected_sites',
            '_selected_action': [self.site1.pk, self.site2.pk]
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
        self.assertIn('attachment; filename="selected_sites.csv"', response['Content-Disposition'])

        # Decode raw CSV text
        csv_text = response.content.decode('utf-8')

        # Ensure quotes are present around comma-containing fields
        self.assertIn('"Has some, commas"', csv_text)
        self.assertIn('"Site A"', csv_text)
        self.assertIn('"Big River"', csv_text)

        # Optional: read CSV properly and count rows
        reader = csv.reader(io.StringIO(csv_text))
        rows = list(reader)

        self.assertEqual(len(rows), 3)  # header + 2 rows
        self.assertEqual(rows[0][0], 'Site Name')

    def test_download_observation_csv(self):
        """
        Test download observation CSV action.
        """

        # Create an observation with full data
        full_observation = Observations.objects.create(
            user=self.admin_user,
            minisass_ml_score=7.5,
            ml_model_version="1.0.0",
            ml_model_type="RandomForest",
            flatworms=True,
            worms=False,
            leeches=True,
            crabs_shrimps=True,
            stoneflies=False,
            minnow_mayflies=True,
            other_mayflies=True,
            damselflies=False,
            dragonflies=True,
            bugs_beetles=True,
            caddisflies=False,
            true_flies=True,
            snails=False,
            collector_name="John Doe",
            score=4.25,
            site=self.site1,
            comment="This is a complete observation with all data fields",
            obs_date=timezone.now().date(),
            submission_date=timezone.now().date(),
            flag="clean",
            is_validated=True,
            water_clarity=45.5,
            water_temp=23.5,
            ph=7.2,
            diss_oxygen=8.5,
            diss_oxygen_unit="mgl",
            elec_cond=120.5,
            elec_cond_unit="mS/m"
        )

        # Create an observation with minimal data (empty water quality parameters)
        minimal_observation = Observations.objects.create(
            user=self.admin_user,
            flatworms=False,
            worms=True,
            leeches=False,
            crabs_shrimps=False,
            stoneflies=True,
            minnow_mayflies=False,
            other_mayflies=False,
            damselflies=True,
            dragonflies=False,
            bugs_beetles=True,
            caddisflies=True,
            true_flies=False,
            snails=True,
            collector_name="Jane Smith",
            site=self.site1,
            comment="This is a minimal observation with empty water quality data",
            obs_date=timezone.now().date(),
            submission_date=timezone.now().date(),
            flag="dirty"
        )

        url = reverse('admin:monitor_observations_changelist')

        # select both sites and trigger CSV download
        data = {
            'action': 'download_records',
            '_selected_action': [minimal_observation.pk, full_observation.pk]
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
        self.assertIn('attachment; filename="observations.csv"', response['Content-Disposition'])

        # Decode raw CSV text
        content = response.content.decode('utf-8')
        csv_reader = csv.reader(content.splitlines())
        csv_data = list(csv_reader)
        expected_csv_data = [
            [
                'Email', 'User Name', 'Surname', 'Organization Name', 'Organization Type', 'User Country',
                'User Expert Status', 'Obs Date', 'Submission Date', 'Site name', 'River name',
                'River category', 'Latitude', 'Longitude', 'Country', 'Flatworms', 'Worms', 'Leeches',
                'Crabs/shrimps', 'Stoneflies', 'Minnow mayflies', 'Other mayflies', 'Damselflies',
                'Dragonflies', 'Bugs/beetles', 'Caddisflies', 'True flies', 'Snails', 'Score', 'ML Score',
                'Status', 'Water clarity', 'Water temp', 'pH', 'Diss oxygen', 'diss oxygen unit', 'Elec cond',
                'Elec cond unit', 'Comment'
            ],
            [
                'admin@example.com', '', '', '', '', 'South Africa', 'False',
                minimal_observation.obs_date.strftime('%Y-%m-%d'),
                minimal_observation.submission_date.strftime('%Y-%m-%d'),
                'Site A', 'Big River', 'rocky', '7.456', '110.123', '', 'False', 'True', 'False', 'False',
                'True', 'False', 'False', 'True', 'False', 'True', 'True', 'False', 'True', '0.00',
                '', 'Unverified', '', '', '', '', 'mgl', '', 'mS/m',
                'This is a minimal observation with empty water quality data'
            ],
            [
                'admin@example.com', '', '', '', '', 'South Africa', 'False',
                minimal_observation.obs_date.strftime('%Y-%m-%d'),
                minimal_observation.submission_date.strftime('%Y-%m-%d'),
                'Site A', 'Big River', 'rocky', '7.456', '110.123', '', 'True', 'False', 'True', 'True',
                'False', 'True', 'True', 'False', 'True', 'True', 'False', 'True', 'False', '4.25',
                '7.5', 'Verified', '45.5', '23.5', '7.2', '8.50', 'mgl', '120.50',
                'mS/m', 'This is a complete observation with all data fields'
            ]
        ]
        self.assertEqual(csv_data, expected_csv_data)
