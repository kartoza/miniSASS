from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse

from minisass.models import PrivacyPolicyConsent
from minisass.tests.factories.privacy_policy import PrivacyPolicyFactory
from minisass_authentication.tests.factories import UserFactory


class PrivacyPolicyTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.privacy_policy = PrivacyPolicyFactory()
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.check_url = reverse("privacy-policy-check")
        self.consent_url = reverse("privacy-policy-consent")

    def test_check_privacy_consent_status(self):
        response = self.client.get(self.check_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("is_agreed_to_privacy_policy", response.data)

    def test_create_privacy_consent(self):
        data = {"agree": True}
        response = self.client.post(self.consent_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            PrivacyPolicyConsent.objects.filter(user=self.user, consent_given=True).exists()
        )
