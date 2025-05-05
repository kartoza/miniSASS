import csv
import io
from django.contrib.admin.sites import site as admin_site
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from monitor.models import Sites

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
            user=self.admin_user
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
