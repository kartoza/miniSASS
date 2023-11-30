from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import models
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User

class AccountActivationTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_activate_account_valid_token(self):
        user = models.User.objects.create(username='testuser')
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        url = reverse('activate-account', kwargs={'uidb64': uidb64, 'token': token})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 302)  # Assuming it redirects
        self.assertIn('activation_complete=true', response.url)

    def test_activate_account_invalid_token(self):
        url = reverse('activate-account', kwargs={'uidb64': 'invalid', 'token': 'invalid'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 400)
        self.assertIn('Token has expired or is invalid', response.data.get('error', ''))


class RegisterTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_valid_data(self):
        valid_data = {
            'name': 'John',
            'surname': 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'organizationName': 'ABC Inc.',
            'country': 'Country Name',
            'organizationType': 'NGO'
        }

        initial_user_count = User.objects.count()

        url = reverse('register')
        response = self.client.post(url, valid_data, format='json')

        self.assertEqual(response.status_code, 201)

        # Check if the user count increased by one after registration
        new_user_count = User.objects.count()
        self.assertEqual(new_user_count, initial_user_count + 1)

    def test_register_invalid_data(self):
        # Prepare invalid user registration data
        invalid_data = {
           'surname': 'Doe',
            'username': 'johndoe',
        }

        url = reverse('register')
        response = self.client.post(url, invalid_data, format='json')

        self.assertEqual(response.status_code, 400)
