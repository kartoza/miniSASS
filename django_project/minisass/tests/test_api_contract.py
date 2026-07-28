# coding=utf-8
"""Contract tests for the endpoints described in docs/src/developer/.

These exist so the developer documentation cannot drift from the implementation
unnoticed. Each test mirrors a documented request and asserts the documented
outcome, so if a payload field or a status code changes, the test fails and the
documentation gets updated with it.
"""

from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.core import mail
from django.core.cache import cache
from unittest.mock import patch
from django.test import override_settings
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase

from minisass.models import GroupScores
from minisass.models.privacy_policy import PrivacyPolicy
from minisass_authentication.models import Lookup
from minisass_authentication.views.minisass_auth import ContactThrottle
from monitor.models import Sites


REGISTRATION = {
    'name': 'Jane',
    'surname': 'Citizen',
    'username': 'jane.citizen',
    'email': 'jane.citizen@example.org',
    'password': 'a-strong-passphrase-1',
    'organizationName': 'Example School',
    'organizationType': 'NGO',
    'country': 'ZA',
    'agree': True,
}


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class AuthenticationContractTest(APITestCase):
    """/authentication/api/... as documented in developer/authentication.md."""

    def setUp(self):
        PrivacyPolicy.objects.create(version='1')
        Lookup.objects.create(description='NGO')

    def test_register_returns_201(self):
        response = self.client.post(
            reverse('register'), REGISTRATION, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            User.objects.filter(email=REGISTRATION['email']).exists())

    def test_register_uses_email_as_username(self):
        """Documented behaviour: the account's username IS the email address."""
        self.client.post(reverse('register'), REGISTRATION, format='json')
        user = User.objects.get(email=REGISTRATION['email'])
        self.assertEqual(user.username, REGISTRATION['email'])
        self.assertEqual(user.first_name, REGISTRATION['name'])
        self.assertEqual(user.last_name, REGISTRATION['surname'])

    def test_register_rejects_duplicate_email(self):
        self.client.post(reverse('register'), REGISTRATION, format='json')
        response = self.client.post(
            reverse('register'), REGISTRATION, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {'error': 'This email is already registered.'})

    def test_login_takes_email_and_password(self):
        self.client.post(reverse('register'), REGISTRATION, format='json')
        # Activation is what the emailed link performs.
        User.objects.filter(email=REGISTRATION['email']).update(is_active=True)
        response = self.client.post(
            reverse('user_login'),
            {'email': REGISTRATION['email'],
             'password': REGISTRATION['password']},
            format='json')
        self.assertEqual(response.status_code, 200)

    def test_login_rejects_an_unactivated_account(self):
        """Login and token issuance must agree about inactive accounts.

        EmailBackend previously skipped Django's is_active check, so an account
        that had never followed its activation link could log in here while
        /api/token/ refused it. Both now reject it.
        """
        self.client.post(reverse('register'), REGISTRATION, format='json')
        response = self.client.post(
            reverse('user_login'),
            {'email': REGISTRATION['email'],
             'password': REGISTRATION['password']},
            format='json')
        self.assertEqual(response.status_code, 401)

    def test_login_rejects_bad_credentials(self):
        self.client.post(reverse('register'), REGISTRATION, format='json')
        response = self.client.post(
            reverse('user_login'),
            {'email': REGISTRATION['email'], 'password': 'wrong'},
            format='json')
        self.assertEqual(response.status_code, 401)

    def test_token_obtain_requires_an_active_account(self):
        """A freshly registered, unactivated account cannot obtain a JWT.

        Both /api/token/ and /api/login/ now refuse inactive accounts, so the two
        agree. See test_login_rejects_an_unactivated_account.
        """
        self.client.post(reverse('register'), REGISTRATION, format='json')
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'username': REGISTRATION['email'],
             'password': REGISTRATION['password']},
            format='json')
        self.assertEqual(response.status_code, 401)

    def test_token_obtain_and_refresh(self):
        """Documented as /api/token/ and /api/token/refresh/."""
        self.client.post(reverse('register'), REGISTRATION, format='json')
        # Activation is what the emailed link performs.
        User.objects.filter(email=REGISTRATION['email']).update(is_active=True)
        obtain = self.client.post(
            reverse('token_obtain_pair'),
            {'username': REGISTRATION['email'],
             'password': REGISTRATION['password']},
            format='json')
        self.assertEqual(obtain.status_code, 200)
        self.assertIn('access', obtain.json())
        self.assertIn('refresh', obtain.json())

        refresh = self.client.post(
            reverse('token_refresh'),
            {'refresh': obtain.json()['refresh']}, format='json')
        self.assertEqual(refresh.status_code, 200)
        self.assertIn('access', refresh.json())

    def test_check_auth_status_requires_authentication(self):
        response = self.client.get(reverse('check-auth-status'))
        self.assertEqual(response.status_code, 401)

    def test_check_auth_status_when_authenticated(self):
        self.client.post(reverse('register'), REGISTRATION, format='json')
        user = User.objects.get(email=REGISTRATION['email'])
        self.client.force_authenticate(user)
        response = self.client.get(reverse('check-auth-status'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['is_authenticated'])

    def test_check_registration_status(self):
        self.client.post(reverse('register'), REGISTRATION, format='json')
        response = self.client.get(reverse(
            'check_registration_status', args=[REGISTRATION['email']]))
        self.assertEqual(response.status_code, 200)
        self.assertIn('is_registration_completed', response.json())

    def test_request_password_reset_unknown_email_returns_404(self):
        response = self.client.post(
            reverse('request_password_reset'),
            {'email': 'nobody@example.org'}, format='json')
        self.assertEqual(response.status_code, 404)


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class SitesContractTest(APITestCase):
    """/monitor/sites/... as documented in developer/sites.md."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='obs@example.org', email='obs@example.org',
            password='pw', first_name='Obs', last_name='User')
        self.site = Sites.objects.create(
            site_name='Documented Site', river_name='Documented River',
            the_geom=Point(30.12743, -29.47565, srid=4326), user=self.user)

    def test_sites_list_is_public(self):
        response = self.client.get(reverse('sites-list-create'))
        self.assertEqual(response.status_code, 200)

    def test_site_detail(self):
        response = self.client.get(
            reverse('site-retrieve-update-destroy', args=[self.site.gid]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['site_name'], 'Documented Site')

    def test_site_count(self):
        response = self.client.get(reverse('site-count'))
        self.assertEqual(response.status_code, 200)

    def test_is_land_accepts_land_coordinate(self):
        """Documented as /monitor/sites/is-land/<lat>/<long>/."""
        response = self.client.get(
            reverse('check-coordinate-is-land', args=['-29.47565', '30.12743']))
        self.assertEqual(response.status_code, 200)


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class ObservationsContractTest(APITestCase):
    """/monitor/observations/... as documented in developer/observations.md."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='obs2@example.org', email='obs2@example.org', password='pw')
        self.site = Sites.objects.create(
            site_name='Obs Site', river_name='Obs River',
            the_geom=Point(30.12743, -29.47565, srid=4326), user=self.user)
        GroupScores.objects.create(name='Flat Worms', sensitivity_score=1)

    def test_observation_list_requires_authentication(self):
        """IsAuthenticatedOrWhitelisted: anonymous access is refused."""
        response = self.client.get(reverse('observation-list-create'))
        self.assertEqual(response.status_code, 401)

    def test_observation_list_when_authenticated(self):
        self.client.force_authenticate(self.user)
        response = self.client.get(reverse('observation-list-create'))
        self.assertEqual(response.status_code, 200)

    def test_recent_observations_is_public(self):
        response = self.client.get(reverse('recent-observation-list'))
        self.assertEqual(response.status_code, 200)

    def test_upload_pest_images_rejects_anonymous(self):
        """This endpoint used to accept a user_id from the body with no auth.

        That let any caller create sites and observations attributed to any user.
        """
        response = self.client.post(
            reverse('upload-pest-images'),
            {'user_id': self.user.id, 'siteId': 0, 'observationId': 0,
             'siteName': 'Spoofed', 'riverName': 'Spoofed',
             'latitude': '-29.47565', 'longitude': '30.12743'})
        self.assertEqual(response.status_code, 401)
        self.assertFalse(Sites.objects.filter(site_name='Spoofed').exists())

    def test_login_token_works_for_upload_end_to_end(self):
        """Log in with email and password, then upload using the returned token.

        This is the exact journey a real user takes, and it is what proves that
        requiring authentication on the upload endpoint does not lock anyone out:
        /authentication/api/login/ hands back an access_token in its response body,
        so no separate token request is needed.
        """
        password = 'a-strong-passphrase-1'
        user = User.objects.create_user(
            username='journey@example.org', email='journey@example.org',
            password=password, is_active=True)

        login = self.client.post(
            reverse('user_login'),
            {'email': 'journey@example.org', 'password': password},
            format='json')
        self.assertEqual(login.status_code, 200)
        token = login.json().get('access_token')
        self.assertTrue(token, 'login must return an access_token')

        # A brand new client, carrying only that token.
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = client.post(
            reverse('upload-pest-images'),
            {'siteId': 0, 'observationId': 0,
             'siteName': 'Journey Site', 'riverName': 'Journey River',
             'latitude': '-29.47565', 'longitude': '30.12743'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            Sites.objects.get(site_name='Journey Site').user, user)

    def test_mobile_login_also_returns_a_token(self):
        """The mobile app uses the same login endpoint, with ?app=mobile."""
        password = 'a-strong-passphrase-1'
        User.objects.create_user(
            username='mobile@example.org', email='mobile@example.org',
            password=password, is_active=True)
        response = self.client.post(
            reverse('user_login') + '?app=mobile',
            {'email': 'mobile@example.org', 'password': password},
            format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json().get('access_token'))
        self.assertTrue(response.json().get('refresh_token'))

    def test_upload_pest_images_attributes_to_authenticated_user(self):
        """A user_id in the payload is ignored in favour of the caller."""
        other = User.objects.create_user(
            username='other@example.org', email='other@example.org', password='pw')
        self.client.force_authenticate(self.user)
        response = self.client.post(
            reverse('upload-pest-images'),
            {'user_id': other.id, 'siteId': 0, 'observationId': 0,
             'siteName': 'Attributed Site', 'riverName': 'Attributed River',
             'latitude': '-29.47565', 'longitude': '30.12743'})
        self.assertEqual(response.status_code, 201)
        site = Sites.objects.get(site_name='Attributed Site')
        self.assertEqual(site.user, self.user, 'must ignore the posted user_id')

    def test_upload_pest_images_rejects_out_of_range_coordinates(self):
        """Reject a latitude outside -90..90 instead of storing it silently.

        These are the real values found in production: latitude -122.08 with
        longitude 37.42, which is the Android emulator's default location with the
        two the wrong way round. PostGIS previously coerced them into range for any
        geography operation, so the bad data was invisible.

        Note a transposition is only detectable this way when one value leaves its
        valid range. A pair like (30.30, -29.55) is individually valid and is caught
        later, by the ocean check, not here.
        """
        self.client.force_authenticate(self.user)
        response = self.client.post(
            reverse('upload-pest-images'),
            {'siteId': 0, 'observationId': 0,
             'siteName': 'Bad Coords', 'riverName': 'Bad Coords',
             'latitude': '-122.08', 'longitude': '37.42'})
        self.assertEqual(response.status_code, 400)
        self.assertIn('out of range', response.json()['message'])
        self.assertFalse(Sites.objects.filter(site_name='Bad Coords').exists())

    def test_observation_count_is_public(self):
        response = self.client.get(reverse('observation-count'))
        self.assertEqual(response.status_code, 200)


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class ContactThrottleTest(APITestCase):
    """The public contact form must be rate limited.

    It is unauthenticated and sends mail to staff, so without a limit it is an
    open relay into the support inboxes.

    The rate is patched on the throttle class rather than through
    override_settings, because DRF binds SimpleRateThrottle.THROTTLE_RATES as a
    class attribute when rest_framework.throttling is imported. Overriding the
    REST_FRAMEWORK setting afterwards therefore has no effect on it.
    """

    def setUp(self):
        # Throttle history lives in the cache and would otherwise leak between
        # tests.
        cache.clear()

    def tearDown(self):
        cache.clear()

    def _submit(self, index, ip='198.51.100.10'):
        return self.client.post(
            reverse('contact_us'),
            {'name': 'Jane', 'email': 'jane@example.org', 'phone': '',
             'message': f'Message {index}'},
            format='json', REMOTE_ADDR=ip)

    @patch.object(ContactThrottle, 'THROTTLE_RATES', {'contact': '3/hour'})
    def test_contact_form_is_rate_limited(self):
        for i in range(3):
            self.assertEqual(self._submit(i).status_code, 200, f'request {i}')
        # The fourth from the same address is refused.
        self.assertEqual(self._submit(3).status_code, 429)
        self.assertEqual(len(mail.outbox), 3, 'no mail beyond the limit')

    @patch.object(ContactThrottle, 'THROTTLE_RATES', {'contact': '3/hour'})
    def test_throttle_is_per_client_not_global(self):
        """One abuser must not lock everyone else out.

        This is the failure mode that NUM_PROXIES guards against in production:
        behind the ALB every request carries the same REMOTE_ADDR, so without it
        a single bucket would be shared by all visitors.
        """
        for i in range(3):
            self._submit(i, ip='198.51.100.10')
        self.assertEqual(self._submit(3, ip='198.51.100.10').status_code, 429)
        # A different client is unaffected.
        self.assertEqual(self._submit(0, ip='203.0.113.55').status_code, 200)

    @patch.object(ContactThrottle, 'THROTTLE_RATES', {'contact': '3/hour'})
    @override_settings(REST_FRAMEWORK={'NUM_PROXIES': 1})
    def test_throttle_identifies_client_through_x_forwarded_for(self):
        """In production every request arrives from the ALB.

        REMOTE_ADDR is therefore the same private address for everyone, and the
        real client is the entry the ALB appends to X-Forwarded-For. NUM_PROXIES
        makes DRF count in from the right, which a caller cannot spoof by
        prepending values of their own.
        """
        alb = '10.0.153.253'

        def submit(client_ip, i):
            return self.client.post(
                reverse('contact_us'),
                {'name': 'Jane', 'email': 'jane@example.org', 'phone': '',
                 'message': f'Message {i}'},
                format='json', REMOTE_ADDR=alb,
                HTTP_X_FORWARDED_FOR=f'{client_ip}')

        for i in range(3):
            self.assertEqual(submit('198.51.100.10', i).status_code, 200)
        self.assertEqual(submit('198.51.100.10', 3).status_code, 429)
        # Same ALB, different real client: must not be throttled.
        self.assertEqual(submit('203.0.113.55', 0).status_code, 200)


class ContactContractTest(APITestCase):
    """/authentication/api/contact-us as documented in developer docs."""

    def setUp(self):
        cache.clear()

    @override_settings(
        EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_contact_us_sets_reply_to_submitter(self):
        response = self.client.post(
            reverse('contact_us'),
            {'name': 'Jane', 'email': 'jane@example.org', 'phone': '',
             'message': 'Hello'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].reply_to, ['jane@example.org'])
