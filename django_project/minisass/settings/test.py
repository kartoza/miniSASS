import tempfile

from django.core.files.storage import FileSystemStorage

from minisass.settings.default import *


ENABLE_GEOCODING = False

# Keep the test suite off object storage entirely.
#
# MINION_STORAGE is attached to model FileFields, so without this override the
# tests upload to whatever bucket the environment happens to name. Run against a
# production credential set and the suite writes test fixtures straight into the
# production media bucket. Settings are fully loaded before models are imported,
# so rebinding it here is picked up by the FileFields.
class _TestMediaStorage(FileSystemStorage):
    """Local storage that mimics the /minio-media/ URLs the app expects."""

    def url(self, name):
        return f'/minio-media/{name}'


MINION_STORAGE = _TestMediaStorage(
    location=tempfile.mkdtemp(prefix='minisass-test-media-'),
)

"""
Test settings for YOMA authentication tests.
"""
# NOTE: "from django.test import override_settings" used to be imported here and
# was never used. Importing django.test from inside a settings module makes
# rest_framework read and cache its configuration before REST_FRAMEWORK is
# visible, so api_settings silently fell back to DRF's defaults for the whole test
# run. That is why throttle rates defined in default.py did not apply under tests.

# Test configuration for YOMA
YOMA_TEST_CONFIG = {
    'YOMA_CLIENT_ID': 'test_client_id',
    'YOMA_CLIENT_SECRET': 'test_client_secret',
    'YOMA_BASE_URI': 'https://stage.yoma.world',
    'YOMA_REDIRECT_URI': 'https://minisass.org/auth/yoma/callback'
}

# Constance test configuration
CONSTANCE_CONFIG = {
    'YOMA_CLIENT_ID': ('test_client_id', 'Test YOMA Client ID'),
    'YOMA_CLIENT_SECRET': ('test_client_secret', 'Test YOMA Client Secret'),
    'YOMA_BASE_URI': ('https://dummystage.yoma.world', 'Test YOMA Base URI'),
    'YOMA_REDIRECT_URI': ('https://dummy.minisass.org/auth/yoma/callback', 'Test YOMA Redirect URI'),
    'YOMA_API_URL': ('https://dummyapi.yoma.world/api/v3', 'Base URI for YOMA API service, without trailing slash'),
}
