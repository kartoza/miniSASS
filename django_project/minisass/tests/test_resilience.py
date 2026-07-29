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

import json
import os
import shutil
from unittest.mock import patch

from cryptography.fernet import InvalidToken
from django.conf import settings
from django.test import TestCase
from django.urls import reverse

from constance.backends.database import DatabaseBackend


def ensure_vite_manifest():
    """
    Let the SPA shell render whether or not the frontend has been built.

    render_vite_bundle reads src/dist/.vite/manifest.json, which npm run build
    produces. The Dockerfile does build it, but docker-compose.yml bind-mounts
    ./django_project over /home/web/django_project and hides it, and dist/ is not
    tracked in git. On a fresh checkout the file is therefore simply absent, the
    tag raises FileNotFoundError, and every test that renders a page fails for a
    reason that has nothing to do with what it is testing.

    A developer rarely sees this because a local checkout usually has a dist/
    left over from an earlier build. CI never does, which is why these tests
    passed locally and failed there.

    Writing a stub keeps the test honest about its subject: these tests are about
    constance decryption and readiness reporting, not about the asset pipeline. A
    real manifest, when one exists, is always preferred and left untouched.

    Returns a callable that removes whatever was created.
    """
    dist = os.path.join(settings.FRONTEND_PATH, 'src', 'dist')
    vite_dir = os.path.join(dist, '.vite')
    manifest = os.path.join(vite_dir, 'manifest.json')
    # The tag falls back to this older location, so a build in either layout counts.
    legacy_manifest = os.path.join(dist, 'manifest.json')

    if os.path.exists(manifest) or os.path.exists(legacy_manifest):
        return lambda: None

    dist_created = not os.path.isdir(dist)
    os.makedirs(vite_dir, exist_ok=True)
    with open(manifest, 'w') as fd:
        json.dump(
            {
                'index.html': {
                    'file': 'assets/test-stub.js',
                    'css': ['assets/test-stub.css'],
                    'dynamicImports': [],
                }
            },
            fd,
        )

    def cleanup():
        shutil.rmtree(dist if dist_created else vite_dir, ignore_errors=True)

    return cleanup


class RendersSpaShellMixin:
    """For tests that render a page through react_base.html."""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls._vite_manifest_cleanup = ensure_vite_manifest()

    @classmethod
    def tearDownClass(cls):
        cls._vite_manifest_cleanup()
        super().tearDownClass()


class ConstanceDecryptionFailureTest(RendersSpaShellMixin, TestCase):
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


class HealthEndpointTest(RendersSpaShellMixin, TestCase):
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


class ErrorPageTest(TestCase):
    """A missing URL must return 404, not 500.

    404.html previously did {% extends "base.html" %}. No project template of that
    name exists, so it resolved to pinax/templates/templates/base.html, which uses
    a {% user_display %} tag that is not loaded. Rendering raised
    TemplateSyntaxError and Django returned 500 for EVERY missing URL, including
    /favicon.ico and /robots.txt.
    """

    def test_missing_url_returns_404_not_500(self):
        with self.settings(DEBUG=False, ALLOWED_HOSTS=['*']):
            response = self.client.get('/definitely-not-a-real-url-9876')
        self.assertEqual(
            response.status_code, 404,
            'a missing URL must 404; a 500 here means the 404 template is broken')

    def test_404_template_renders_standalone(self):
        """It must not depend on {% extends %} or a third-party base template."""
        from django.template.loader import render_to_string
        html = render_to_string('404.html')
        self.assertIn('miniSASS', html)

    def test_500_template_renders_standalone(self):
        from django.template.loader import render_to_string
        html = render_to_string('500.html')
        self.assertIn('miniSASS', html)

    def test_favicon_is_routed(self):
        """Browsers request /favicon.ico at the root regardless of link tags."""
        response = self.client.get('/favicon.ico')
        self.assertIn(response.status_code, (301, 302))
        self.assertIn('favicon', response['Location'])
