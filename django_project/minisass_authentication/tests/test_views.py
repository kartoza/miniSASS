from django.test import TestCase
from constance.test import override_config
from unittest.mock import patch
from minisass_authentication.models import Lookup
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes
from django.utils.http import (
    urlsafe_base64_encode
)
from django.contrib.auth.tokens import default_token_generator
from minisass_authentication.tests.factories import UserFactory
from minisass_authentication.models import PENDING_STATUS
from minisass.models.privacy_policy import PrivacyPolicy
from rest_framework import status

from minisass_authentication.utils import get_user_privacy_consent


class PasswordResetTest(APITestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_verify_password_reset(self):
        # Generate token and UID for user
        token = default_token_generator.make_token(self.user)
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

        # Verify password reset link
        url = reverse('verify_password_reset', kwargs={'uidb64': uidb64, 'token': token})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

    def test_update_password_reset(self):
        # Generate token and UID for user
        token = default_token_generator.make_token(self.user)
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

        # Update password using reset link
        new_password = 'newpassword123'
        url = reverse('update_password_reset', kwargs={'uid': uidb64, 'token': token})
        data = {'newPassword': new_password}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)

    def test_update_password_reset_password_exist(self):
        """
        Test update password fails when new password has been used by that user.
        """

        # Update password using reset link
        new_password = 'newpassword123'
        self.user.set_password(new_password)
        self.user.save()

        # Generate token and UID for user
        token = default_token_generator.make_token(self.user)
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

        self.client.force_authenticate(user=self.user)
        url = reverse('update_password_reset', kwargs={'uid': uidb64, 'token': token})
        data = {'newPassword': new_password}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {
                'error': 'This password has been used before. Please choose a new and unique password.'
            }
        )


class ActivateAccountTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        # Generate token with a specific duration
        self.token_info = default_token_generator.make_token(self.user)
        self.token = self.token_info
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        Lookup.objects.create(description='NGO')
        

    def test_activate_account_valid_token(self):
        # Create the activation URL
        url = reverse('activate-account', kwargs={'uidb64': self.uidb64, 'token': self.token})
        
        # Make a GET request to the activation URL
        response = self.client.get(url)

        # Asserts
        self.assertEqual(response.status_code, 302)  # Assuming it redirects
        self.assertIn('activation_complete=true', response.url)


class RegisterTest(APITestCase):

    def setUp(self):
        super().setUp()
        PrivacyPolicy.objects.create(
            version='1'
        )

    def test_register_valid_data(self):
        valid_data = {
           'surname': 'Doe',
           'username': 'johndoe',
           'name': 'johndoe',
           'organizationName': 'johndoe',
           'organizationType': 'NGO',
           'country': 'SA',
           'email': 'em@gmail.com',
           'password': 'p',
            'agree': True
        }

        url = reverse('register')
        response = self.client.post(url, valid_data, format='json')

        self.assertEqual(response.status_code, 201)
        consent = get_user_privacy_consent(User.objects.get(email=valid_data['email']))
        self.assertIsNotNone(consent)

    def test_register_invalid_data(self):
        # Prepare invalid user registration data
        invalid_data = {
           'surname': 'Doe',
            'username': 'johndoe',
        }

        url = reverse('register')
        response = self.client.post(url, invalid_data, format='json')

        self.assertEqual(response.status_code, 400)

    def test_register_multiple_lookup(self):
        Lookup.objects.create(description='Consultancy')
        Lookup.objects.create(description='Consultancy')
        valid_data = {
           'surname': 'Doe',
           'username': 'johndoe',
           'name': 'johndoe',
           'organizationName': 'johndoe',
           'organizationType': 'Consultancy',
           'country': 'SA',
           'email': 'em@gmail.com',
           'password': 'p',
            'agree': True
        }

        url = reverse('register')
        response = self.client.post(url, valid_data, format='json')

        self.assertEqual(response.status_code, 201)


class UpdateUserTest(APITestCase):
    def setUp(self):
        self.user = UserFactory.create()
        self.base_payload = {
            "username": f"{self.user.username}_new",
            "email": f"new_{self.user.email}",
            "name": "New Name",
            "surname": "New Surname",
            "organisation_type": "School",
            "organisation_name": "New School",
            "country": "ZA",
            "upload_preference": "both",
        }
        self.url = reverse('profile-update')

    def test_not_authenticated(self):
        response = self.client.get(self.url)
        self.assertEquals(response.status_code, 401)

    def test_update_works(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(self.url, self.base_payload, format='json')
        self.assertEquals(response.status_code, 200)
        expected_response = self.base_payload
        expected_response['is_expert'] = False
        expected_response['user_id'] = str(self.user.id)
        self.assertEquals(
            response.json(),
            expected_response
        )

    def test_update_empty_name_surname(self):
        self.client.force_authenticate(self.user)
        payload = self.base_payload
        payload['name'] = ''
        payload['surname'] = ''
        response = self.client.post(self.url, payload, format='json')
        self.assertEquals(response.status_code, 400)
        self.assertEquals(
            response.json(),
            {'name': ['This field may not be blank.'], 'surname': ['This field may not be blank.']}
        )


# Commenting this test for now, since there it failed during deployment.
# We run test once container is built, so it will also run on deployment.
# The uploaded filename has some sort of hash in it. It means, there's already file named download-1.jpg
# in the directory, which could be from previous deployment.

# class UploadCertificateTest(APITestCase):
#     def setUp(self):
#         self.user = UserFactory.create()
#         self.url = reverse('certificate-upload')
#
#     @patch('minisass_authentication.views.send_mail', autospec=True)
#     def test_upload_certificate(self, mock_send_mail):
#         self.client.force_authenticate(self.user)
#         with open('minisass_frontend/static/images/download-1.jpg', 'rb') as fp:
#             response = self.client.post(self.url, {'certificate': fp})
#             self.user.refresh_from_db()
#             self.assertEquals(response.status_code, 200)
#             self.assertEquals(
#                 response.json(),
#                 {'certificate': f'/minio-media/demo/{self.user.id}/download-1.jpg'}
#             )
#             # Expertise is not updated automatically
#             self.assertFalse(self.user.userprofile.is_expert)
#             mock_send_mail.assert_called_once()
#             # Expert approval status is now pending
#             self.assertEquals(self.user.userprofile.expert_approval_status, PENDING_STATUS)


class UpdatePasswordTest(APITestCase):
    def setUp(self):
        self.user = UserFactory.create()
        self.user.set_password('qwertY1@')
        self.user.save()
        self.client.force_authenticate(self.user)
        self.url = reverse('password-update')
        self.base_payload = {
            'old_password': 'qwertY1@',
            'password': 'qwertY1@_new',
            'confirm_password': 'qwertY1@_new',
        }

    def test_update_password_works(self):
        response = self.client.post(self.url, self.base_payload)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.json(), {'status': 'OK'})

    def test_update_password_wrong_old_password(self):
        payload = self.base_payload
        payload['old_password'] = 'qwertY1'
        response = self.client.post(self.url, self.base_payload)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.json(), {'old_password': ['Wrong old password']})

    def test_update_password_password_not_strong(self):
        payload = self.base_payload
        payload.update({
            'old_password': 'qwertY1@',
            'password': 'aa',
            'confirm_password': 'aa',
        })
        response = self.client.post(self.url, payload)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(
            response.json(),
            {'password': ['Missing password criteria: uppercase, digit, specialCharacter, length']}
        )

    def test_update_password_password_has_been_used(self):
        payload = self.base_payload
        payload.update({
            'old_password': 'qwertY1@',
            'password': 'qwertY1@',
            'confirm_password': 'qwertY1@',
        })
        response = self.client.post(self.url, payload)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(
            response.json(),
            {'password': ['This password has been used before. Please choose a new and unique password.']}
        )


class CheckAuthenticationStatusTest(APITestCase):
    def setUp(self):
        self.user = UserFactory.create()
        self.url = reverse('check-auth-status')

    def test_check_authentication_status_authenticated(self):
        self.client.force_authenticate(self.user)
        response = self.client.get(self.url)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(
            sorted(response.json().keys()),
            [
                'accepted_privacy_policy_version',
                'access_token', 'email', 'is_admin',
                'is_agreed_to_privacy_policy',
                'is_authenticated', 'is_profile_updated', 'refresh_token',
                'user_id', 'username'
            ]
        )

    def test_check_authentication_status_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEquals(response.status_code, 401)
        self.assertEquals(
            response.json(),
            {'detail': 'Authentication credentials were not provided.'}
        )


class CheckRegistrationStatusTest(APITestCase):
    def setUp(self):
        self.user = UserFactory.create()
        self.client.force_authenticate(self.user)

    def test_check_registration_status_completed(self):
        url = reverse('check_registration_status', args=[self.user.email])
        response = self.client.get(url)
        self.assertEquals(
            response.json(),
            {'email': self.user.email, 'is_registration_completed': True}
        )

    def test_check_registration_status_incomplete(self):
        self.user.is_active = False
        self.user.save()
        url = reverse('check_registration_status', args=[self.user.email])
        response = self.client.get(url)
        self.assertEquals(
            response.json(),
            {'email': self.user.email, 'is_registration_completed': False}
        )

    def test_check_registration_email_not_exist(self):
        url = reverse('check_registration_status', args=['a@kartoza.com'])
        response = self.client.get(url)
        self.assertEquals(
            response.json(),
            {'error': 'User not found.'}
        )


class CheckIsExpertTest(APITestCase):
    def setUp(self):
        self.user = UserFactory.create()
        self.client.force_authenticate(self.user)

    def test_check_is_expert(self):
        url = reverse('user-profile-is-expert', args=[self.user.email])
        response = self.client.get(url)
        self.assertEquals(
            response.json(),
            {
                'id': self.user.userprofile.id,
                'organisation_name': '',
                'country': None,
                'is_expert': False,
                'is_password_enforced': True,
                'expert_approval_status': 'REJECTED',
                'certificate': None,
                'user': self.user.id,
                'organisation_type': None,
                'upload_preference': 'wifi'
            }
        )


class LoginTest(APITestCase):
    def test_login_strong_password(self):
        user = UserFactory.create()

        # set password to meet criteria
        password = 'qwertY1@'
        user.set_password(password)
        user.save()

        # Set is_password_enforced = False, meaning it could be an old user
        user.userprofile.is_password_enforced = False
        user.userprofile.save()

        url = reverse('user_login')
        payload = {
            'email': user.email,
            'password': password
        }
        response = self.client.post(url, payload, format='json')
        self.assertEquals(
            response.json()['username'],
            user.username,
        )
        self.assertEquals(
            response.json()['email'],
            user.email,
        )
        self.assertTrue(
            response.json()['is_profile_updated']
        )

    def test_login_weak_password(self):
        user = UserFactory.create()

        # set password to weak password
        password = 'admin'
        user.set_password(password)
        user.save()

        url = reverse('user_login')
        payload = {
            'email': user.email,
            'password': password
        }
        response = self.client.post(url, payload, format='json')
        self.assertEquals(
            response.json()['username'],
            user.username,
        )
        self.assertEquals(
            response.json()['email'],
            user.email,
        )
        self.assertFalse(
            response.json()['is_profile_updated']
        )


class TestContactUs(APITestCase):
    """
    Test Contact Us view.
    """

    @patch('minisass_authentication.views.minisass_auth.send_mail')
    def test_contact_us(self, mock_mail):
        """
        Test Contact Us works without phone number and without login.
        """

        url = reverse('contact_us')
        payload = {
            'name': 'Name',
            'email': 'name@kartoza.com',
            'phone': '',
            'message': 'Test message'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEquals(response.status_code, 200)
        mock_mail.assert_called_once()
