# coding=utf-8
"""Regression tests for the outage caused by rotating SECRET_KEY.

Constance values are encrypted with a key derived from settings.SECRET_KEY.
Changing the key made every stored value undecryptable, and because
ReactBaseView reads three of them on every render, the whole site returned 500.
The load balancer health check probed a static endpoint and kept passing, so
nothing detected it.

These tests pin both halves of the fix: pages must survive a decryption failure,
and the readiness endpoint must actually notice when the application cannot serve.
"""

from unittest.mock import patch

from cryptography.fernet import InvalidToken
from django.test import TestCase
from django.urls import reverse

from constance.backends.database import DatabaseBackend


class ConstanceDecryptionFailureTest(TestCase):
    """A value encrypted under a different SECRET_KEY must not break the site."""

    def test_home_page_still_renders(self):
        with patch.object(DatabaseBackend, 'get', side_effect=InvalidToken):
            response = self.client.get(reverse('home'))
        self.assertEqual(
            response.status_code, 200,
            'the home page must render even when constance cannot be decrypted')

    def test_map_page_still_renders(self):
        """ReactBaseView serves several routes; all read the same values."""
        with patch.object(DatabaseBackend, 'get', side_effect=InvalidToken):
            response = self.client.get(reverse('map'))
        self.assertEqual(response.status_code, 200)

    def test_backend_falls_back_to_the_configured_default(self):
        from django.conf import settings as django_settings
        from minisass.constance.backend import EncryptedDatabaseBackend

        with patch.object(DatabaseBackend, 'get', side_effect=InvalidToken):
            value = EncryptedDatabaseBackend.get(
                EncryptedDatabaseBackend.__new__(EncryptedDatabaseBackend),
                'YOMA_BASE_URI')
        self.assertIsNone(
            value, 'returning None is what makes constance use the default')
        # And the declared default is a usable value rather than empty.
        self.assertTrue(
            django_settings.CONSTANCE_CONFIG['YOMA_BASE_URI'][0])


class HealthEndpointTest(TestCase):
    """Liveness answers "is the process up"; readiness answers "can it serve"."""

    def test_liveness_is_cheap_and_always_ok(self):
        response = self.client.get(reverse('health'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')

    def test_readiness_reports_each_dependency(self):
        response = self.client.get(reverse('health-ready'))
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body['status'], 'ok')
        for dependency in ('database', 'settings', 'frontend'):
            self.assertEqual(body['checks'][dependency], 'ok', dependency)

    def test_readiness_returns_503_when_the_database_is_unreachable(self):
        """The check that a static health endpoint could never make."""
        with patch('django.db.connection.cursor', side_effect=Exception('boom')):
            response = self.client.get(reverse('health-ready'))
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()['status'], 'unhealthy')
        self.assertIn('error', response.json()['checks']['database'])
