from django.test import TestCase
from minisass_authentication.models import Lookup
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes
from django.utils.http import (
    urlsafe_base64_encode
)
from minisass_authentication.email_verification_token import email_verification_token
from django.contrib.auth.tokens import default_token_generator

class PasswordResetTest(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test',
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
        data = {'new_password': new_password}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200) 
        
class ActivateAccountTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = email_verification_token.make_token(self.user)
        Lookup.objects.create(description='NGO')
        

    def test_activate_account_valid(self):
        url = reverse(
            'activate-account',
            kwargs={'uidb64': self.uidb64, 'token': self.token}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

class RegisterTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_invalid_data(self):
        # Prepare invalid user registration data
        invalid_data = {
           'surname': 'Doe',
            'username': 'johndoe',
        }

        url = reverse('register')
        response = self.client.post(url, invalid_data, format='json')

        self.assertEqual(response.status_code, 400)
