from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.admin.sites import AdminSite
from minisass_authentication.admin import UserAdmin, correct_country
from minisass_authentication.models import UserProfile, CountryMapping


class CorrectCountryAdminActionTest(TestCase):
    fixtures = ['country_mappings.json']

    def setUp(self):
        self.site = AdminSite()
        self.admin = UserAdmin(User, self.site)

        self.country_mappings = CountryMapping.objects.all()

        self.users = []
        for i, country_mapping in enumerate(self.country_mappings):
            input_val, expected = country_mapping.key, country_mapping.value
            user = User.objects.create(username=f"user{i}")
            user.userprofile.country = input_val
            user.userprofile.save()
            self.users.append((user, expected))
        user = User.objects.create(username=f"user{self.country_mappings.count()}")
        user.userprofile.country = '999999999'
        user.userprofile.save()
        self.users.append((user, '999999999'))

    def test_correct_country_bulk(self):
        queryset = User.objects.filter(pk__in=[u.pk for u, _ in self.users])
        mock_request = type("Request", (), {})()  # Dummy request object

        correct_country(self.admin, mock_request, queryset)

        for user, expected_country in self.users:
            with self.subTest(user=user.username):
                user.userprofile.refresh_from_db()
                self.assertEqual(user.userprofile.country, expected_country)
