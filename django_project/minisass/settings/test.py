from minisass.settings.default import *


ENABLE_GEOCODING = False

"""
Test settings for YOMA authentication tests.
"""
from django.test import override_settings

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
    'YOMA_BASE_URI': ('https://stage.yoma.world', 'Test YOMA Base URI'),
    'YOMA_REDIRECT_URI': ('https://minisass.org/auth/yoma/callback', 'Test YOMA Redirect URI'),
}
