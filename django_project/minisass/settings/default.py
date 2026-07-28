import ast
import os
from datetime import timedelta
from pathlib import Path
from collections import OrderedDict

from storages.backends.s3boto3 import S3Boto3Storage

from minisass.utils import absolute_path

# NOTE: drf_yasg must NOT be imported in this module. It pulls in rest_framework,
# which caches settings.REST_FRAMEWORK on first import. See minisass/swagger.py.

PROJECT_PATH = os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))
)

ALLOWED_HOSTS = ['*']

INTERNAL_IPS = ['127.0.0.1']

# Comma-separated client IPs allowed to reach endpoints guarded by
# IsAuthenticatedOrWhitelisted without authenticating (used by non-JWT API
# consumers). A bare .split(',') on an unset value yields [''], which then made
# every membership test behave oddly; filtering blanks gives a clean empty list.
WHITELISTED_IP_ADDRESSES = [
    ip.strip() for ip in os.getenv('WHITELISTED_IP_ADDRESSES', '').split(',')
    if ip.strip()
]

# Number of trusted reverse proxies in front of the application, used when
# resolving the real client IP for the whitelist. In this deployment nginx sits in
# the same task behind an ALB, so REMOTE_ADDR is the ALB's private address and
# X-Forwarded-For must be consulted instead. The rightmost entries of
# X-Forwarded-For are appended by trusted proxies, so we take the entry this many
# positions from the end. Set to 0 to trust REMOTE_ADDR only.
TRUSTED_PROXY_DEPTH = int(os.getenv('TRUSTED_PROXY_DEPTH', '1'))

DEBUG = ast.literal_eval(os.getenv('DEBUG', 'False'))
# if DEBUG:
#     CORS_ALLOWED_ORIGINS = [
#         "http://localhost:5173",
#         "http://0.0.0.0:5173",
#         "http://localhost:5000",
#         "http://0.0.0.0:5000",
#     ]
#     CSRF_TRUSTED_ORIGINS = [
#         "http://localhost:5173",
#         "http://0.0.0.0:5173",
#         "http://localhost:5000",
#         "http://0.0.0.0:5000",
#     ]
#     CORS_ALLOW_ALL_ORIGINS = True
#     CORS_ALLOW_CREDENTIALS = True
#     # For CSRF token access in JavaScript
#     CSRF_COOKIE_HTTPONLY = False
#     # CSRF_COOKIE_SAMESITE = "Lax"
# "or" rather than a getenv default: a variable that is SET BUT EMPTY (as in
# .example.env, which ships SECRET_KEY= for you to fill in) returns '' from
# os.getenv, not the default, and Django refuses to start on an empty SECRET_KEY.
# Always set a real value in any deployed environment; this fallback exists only so
# a fresh clone boots.
SECRET_KEY = os.getenv('SECRET_KEY') or '#vdoy$8tv)5k06)o(+@hyjbvhw^4$q=ub0whn*@k*1s9wwnv9i'


# Recipients of unhandled-exception mail when DEBUG is False. Kept as the
# maintaining team rather than individuals from the original build contract.
ADMINS = (
    ('miniSASS admin team', 'info@minisass.org'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.getenv('DJANGO_DB', ''),
        'USER': os.getenv('POSTGRES_USER', ''),
        'PASSWORD': os.getenv('POSTGRES_PASS', ''),
        'HOST': os.getenv('DATABASE_HOST', ''),
        'PORT': os.getenv('DATABASE_PORT', ''),
        'OPTIONS': {'sslmode': 'require'}
    }
}


TIME_ZONE = 'Africa/Johannesburg'
LANGUAGE_CODE = 'en'
LANGUAGES = [
    ('en', 'English')
]
SITE_ID = 1
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Define the default paths
DEFAULT_MEDIA_ROOT = '/home/web/media'
DEFAULT_MEDIA_URL = '/media/'
DEFAULT_STATIC_ROOT = '/home/web/static'
DEFAULT_STATIC_URL = '/static/'
FRONTEND_DIST_ROOT = PROJECT_PATH.replace('/minisass', '/minisass_frontend')

# Get values from environment variables or use defaults
MEDIA_ROOT = os.getenv('MEDIA_ROOT', DEFAULT_MEDIA_ROOT)
MEDIA_URL = os.getenv('MEDIA_URL', DEFAULT_MEDIA_URL)
STATIC_ROOT = os.getenv('STATIC_ROOT', DEFAULT_STATIC_ROOT)
STATIC_URL = os.getenv('STATIC_URL', DEFAULT_STATIC_URL)

# Frontend path to be used in vite template
FRONTEND_PATH = FRONTEND_DIST_ROOT

# S3 settings for static files
AWS_STORAGE_BUCKET_NAME = os.getenv("MINIO_AI_BUCKET")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME", "af-south-1")
AWS_LOCATION = os.getenv("AWS_LOCATION", "static")

AWS_QUERYSTRING_AUTH = False

AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com"
# AWS_S3_ENDPOINT_URL = f"https://s3.{AWS_S3_REGION_NAME}.amazonaws.com"

# STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_LOCATION}/"



# Additional locations of static files
STATICFILES_DIRS = (
    absolute_path('minisass', 'static'),
    absolute_path('minisass_frontend', 'static'),
    absolute_path('minisass_frontend', 'src', 'dist'),
    # Collected under /static/webmapping/ so the MapLibre style and its sprite
    # sheet are served by this deployment. Previously the frontend fetched the
    # style (and its sprite) at runtime from a third-party GitHub repository,
    # which meant this committed copy was never actually used.
    ('webmapping', absolute_path('webmapping', 'styles')),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Abuse limits for the public, unauthenticated endpoints that send mail.
    # Applied per view via ScopedRateThrottle rather than globally, so ordinary
    # API traffic is untouched.
    'DEFAULT_THROTTLE_RATES': {
        # Contact/support form. A person sends one; a bot sends thousands.
        'contact': os.getenv('THROTTLE_CONTACT', '5/hour'),
        # Password reset. Limits using the form to mail-bomb someone's inbox.
        'password_reset': os.getenv('THROTTLE_PASSWORD_RESET', '5/hour'),
    },
    # ESSENTIAL behind the load balancer.
    #
    # DRF identifies an anonymous client by REMOTE_ADDR unless NUM_PROXIES is set.
    # nginx and Django share an ECS task behind an ALB, so REMOTE_ADDR is the ALB's
    # private address and is identical for every visitor. Without this, all users
    # would share a single throttle bucket and the first few requests would lock out
    # everyone. With it set, DRF counts in from the right of X-Forwarded-For, which
    # is the portion trusted proxies append and a caller cannot spoof.
    'NUM_PROXIES': int(os.getenv('TRUSTED_PROXY_DEPTH', '1')),
}

# Throttle counters live in the cache. The default LocMemCache is per process, and
# uwsgi runs several workers, so the effective limit is multiplied by the worker
# count. That is still a very large reduction from unlimited, and it adds no new
# infrastructure or failure mode. Point CACHE_URL at a shared Redis to make the
# limits exact.
if os.getenv('CACHE_URL'):
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': os.getenv('CACHE_URL'),
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'minisass-default',
        }
    }

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# DEFAULT_INFO is a dotted path, not an imported object. Importing drf_yasg from
# this module breaks DRF's settings (see minisass/swagger.py for the detail).
SWAGGER_SETTINGS = {
    'DEFAULT_INFO': 'minisass.swagger.api_info',
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(FRONTEND_PATH, 'templates'),
            os.path.join(PROJECT_PATH, '../templates'),
            os.path.join(PROJECT_PATH.replace('/minisass', '/minisass_authentication'), 'templates', 'registration'),
            os.path.join(PROJECT_PATH, 'monitor' , 'templates' , 'monitor')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.csrf',
            ],
        },
    },
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.common.CommonMiddleware',
    'minisass.tensorflow_memory_limit.TensorFlowMemoryMiddleware'
]

# Google analytics
GOOGLE_ANALYTICS_TRACKING_CODE = os.getenv('GOOGLE_ANALYTICS_TRACKING_CODE', '')

ROOT_URLCONF = 'minisass.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'minisass.wsgi.application'

# email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('SMTP_HOST', 'smtp')
EMAIL_PORT = int(os.getenv('SMTP_PORT') or 25)
# With Amazon SES this is an SMTP credential (an access key id), not an address.
EMAIL_HOST_USER = os.getenv('SMTP_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('SMTP_HOST_PASSWORD', 'docker')
# Must be parsed, not used as a raw string: the non-empty string 'False' is truthy
# in Python, so the previous version enabled TLS whenever the variable was set to
# anything at all, including "False".
EMAIL_USE_TLS = str(os.getenv('SMTP_EMAIL_TLS', 'False')).strip().lower() in (
    '1', 'true', 'yes', 'on')
# Automated mail (activation, password reset, observation notifications) is sent
# from this address. It is a send-only identity; nothing monitors replies.
# 'or' so a set-but-empty value still yields a usable From address.
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL') or 'no-reply@minisass.org'

def _email_list(env_name, default):
    """Parse a comma-separated recipient list from the environment."""
    values = [
        address.strip()
        for address in os.getenv(env_name, '').split(',')
        if address.strip()
    ]
    return values or list(default)


# Who receives mail the application generates.
#
# Defaults are deliberately the role addresses, not individuals: this repository is
# public, and hardcoding staff addresses here would publish them to scrapers. Set
# the real recipients through the environment (they come from Secrets Manager in
# production), which also means routing changes need no code deploy.
CONTACT_US_RECIPIENT_EMAILS = _email_list(
    'CONTACT_US_RECIPIENT_EMAILS', ['info@minisass.org'])

SUPPORT_RECIPIENT_EMAILS = _email_list(
    'SUPPORT_RECIPIENT_EMAILS', ['support@minisass.org'])

EXPERT_APPROVAL_RECIPIENT_EMAILS = _email_list(
    'EXPERT_APPROVAL_RECIPIENT_EMAILS', CONTACT_US_RECIPIENT_EMAILS)

# Retained because existing code refers to the singular name.
CONTACT_US_RECEPIENT_EMAIL = CONTACT_US_RECIPIENT_EMAILS[0]
# Note: EXPERT_APPROVAL_RECIPIENT_EMAIL was defined here but never read by any
# code. Kept as an alias so nothing breaks if something starts using it.
EXPERT_APPROVAL_RECIPIENT_EMAIL = EXPERT_APPROVAL_RECIPIENT_EMAILS[0]

# django registration/auth settings
# ACCOUNT_ACTIVATION_DAYS = 7
# LOGIN_REDIRECT_URL = '/'
# AUTH_PROFILE_MODULE = "minisass_authentication.UserProfile"

SENTRY_KEY = os.environ.get('SENTRY_KEY', '')
if SENTRY_KEY != '':
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    sentry_sdk.init(
        dsn=SENTRY_KEY,
        integrations=[DjangoIntegration()]
    )

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'drf_yasg',
    'django.contrib.admin',
    'django.contrib.gis',
    'storages',
    'constance',
    'constance.backends.database',
    # custom apps here:
    'rest_framework',
    'rest_framework_simplejwt',
    'leaflet',
    'minisass_frontend',
    'minisass_authentication',
    'monitor',
    'minisass',
    'pinax.announcements',
    'bootstrapform',
    'pinax.templates',
    # 'google_analytics'
]

PROJECT_APPS = ['minisass_authentication']

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'formatters': {
        'verbose': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
        },
    },
    'handlers': {
        # Previously the ONLY handler was mail_admins, which depends on working
        # SMTP. With mail misconfigured there was nowhere for an application error
        # to go, which is a large part of why a total submission outage produced no
        # visible signal. uwsgi logs to stdio, so stdout reaches CloudWatch.
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django.request': {
            'handlers': ['console', 'mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        # Application loggers (monitor.*, minisass.*, minisass_authentication.*)
        # inherit the root console handler.
    }
}

# S3/Minio config
MINIO_ROOT = os.getenv('MINIO_ROOT', '/home/web/minio')
# MINIO_BUCKET is used as the directory prefix in file paths (e.g. minisass/observations/...)
# This must be consistent across environments so URLs in the DB remain valid.
MINIO_BUCKET = os.getenv('MINIO_BUCKET', 'demo')

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'minisass_authentication.backends.EmailBackend',
]

MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY") or os.getenv("AWS_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY") or os.getenv("AWS_SECRET_ACCESS_KEY")
# MINIO_AI_BUCKET is the actual S3 bucket name for boto3 operations.
# On staging this differs from MINIO_BUCKET (e.g. minisass-staging vs minisass).
MINIO_AI_BUCKET = os.getenv("MINIO_AI_BUCKET", os.getenv("MINIO_BUCKET", "demo"))
MINIO_ENDPOINT = os.getenv("MINIO_URL")


# Custom S3 storage that returns /minio-media/ URLs for nginx proxy
class MinisassS3Storage(S3Boto3Storage):
    """S3 storage backend that generates /minio-media/ URLs for nginx proxy."""
    def url(self, name):
        return f'/minio-media/{name}'


# No object ACL is sent by default.
#
# The media bucket uses ObjectOwnership=BucketOwnerEnforced, which is the current
# S3 default and rejects any request carrying an ACL with
# "AccessControlListNotSupported". Sending default_acl='public-read' therefore made
# every photo upload fail with a 500. Public readability comes from the bucket
# policy instead, so no ACL is needed.
#
# Set AWS_DEFAULT_ACL only for a legacy bucket or a MinIO deployment that still
# relies on per-object ACLs.
MINIO_DEFAULT_ACL = os.getenv('AWS_DEFAULT_ACL') or None

# S3 storage instance used by model FileFields
MINION_STORAGE = MinisassS3Storage(
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    bucket_name=MINIO_AI_BUCKET,
    region_name=os.getenv('AWS_S3_REGION_NAME', 'af-south-1'),
    endpoint_url=MINIO_ENDPOINT if MINIO_ENDPOINT else None,
    default_acl=MINIO_DEFAULT_ACL,
    querystring_auth=False,
    file_overwrite=False,
)

ENABLE_GEOCODING = True

# How far outside a country polygon a coordinate may sit and still be accepted,
# in metres. Coastlines in any world-boundaries dataset are simplified, so river
# mouths can land a few hundred metres "offshore". Validated against production
# data: genuine coastal sites were 0.16-1.03km out, while sites with transposed
# lat/lon were 840km+ out. Set to 0 to require a strict polygon hit.
COUNTRY_LOOKUP_COASTAL_TOLERANCE_M = int(
    os.getenv('COUNTRY_LOOKUP_COASTAL_TOLERANCE_M', '2000'))

# Country lookup / ocean validation service (monitor.utils).
# A new site's coordinate is intersected against a world-boundaries WFS layer to
# derive its ISO country code and to reject coordinates that fall in the ocean.
#
# The defaults still point at the third-party service this project has always
# used. Override them to retire that dependency once an IWMI-hosted
# world-boundaries layer is available; no code change is needed.
COUNTRY_LOOKUP_WFS_URL = os.getenv(
    'COUNTRY_LOOKUP_WFS_URL', 'https://maps.kartoza.com/geoserver/kartoza/ows')
COUNTRY_LOOKUP_WFS_TYPENAME = os.getenv(
    'COUNTRY_LOOKUP_WFS_TYPENAME', 'kartoza:world')
COUNTRY_LOOKUP_WFS_GEOMETRY = os.getenv(
    'COUNTRY_LOOKUP_WFS_GEOMETRY', 'the_geom')


# DJANGO CONSTANCE
CONSTANCE_BACKEND = 'minisass.constance.backend.EncryptedDatabaseBackend'
CONSTANCE_CONFIG = OrderedDict([
    ('YOMA_CLIENT_ID', ('', 'YOMA Client ID')),
    ('YOMA_CLIENT_SECRET', ('', 'YOMA Client Secret')),
    ('YOMA_REDIRECT_URI', ('', 'YOMA Redirect URI')),
    ('YOMA_AUTH_URI', ('https://stage.yoma.world/auth/realms/yoma/protocol/openid-connect/auth', '')),
    ('YOMA_BASE_URI', ('https://stage.yoma.world', 'Base URI for YOMA service, without trailing slash')),
    ('YOMA_API_URL', ('https://api.yoma.world/api/v3', 'Base URI for YOMA API service, without trailing slash')),
])