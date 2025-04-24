from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.admin.sites import AdminSite
from minisass_authentication.admin import UserAdmin, correct_country
from minisass_authentication.models import UserProfile


class CorrectCountryAdminActionTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = UserAdmin(User, self.site)

        self.country_mapping = {
            'ZA': 'ZA', '9': 'ZA', 'South Africa': 'ZA', 'MY': 'MY', 'Kenya': 'KE', 'NA': 'NA', 'None': 'ZA',
            '101': 'IN', '109': 'ZA', '16': 'ZA', '104': 'IT', '169': 'TZ', '73': 'DK', '81': 'ES', '188': 'MG',
            '55': 'CA', '87': 'GB', '135': 'ZA', '144': 'PL', '166': 'TR', '17': 'MW', '133': 'MX', 'N/A': 'ZA',
            '239': 'AU', '14': 'ZW'
        }

        self.users = []
        for i, (input_val, expected) in enumerate(self.country_mapping.items()):
            user = User.objects.create(username=f"user{i}")
            user.userprofile.country = input_val
            user.userprofile.save()
            self.users.append((user, expected))

    def test_correct_country_bulk(self):
        queryset = User.objects.filter(pk__in=[u.pk for u, _ in self.users])
        mock_request = type("Request", (), {})()  # Dummy request object

        correct_country(self.admin, mock_request, queryset)

        for user, expected_country in self.users:
            with self.subTest(user=user.username):
                user.userprofile.refresh_from_db()
                self.assertEqual(user.userprofile.country, expected_country)
