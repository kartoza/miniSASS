import ast
from datetime import timedelta
from pathlib import Path
import os

from minisass.utils import absolute_path


PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

CSRF_TRUSTED_ORIGINS = []

INTERNAL_IPS = ['127.0.0.1']

DEBUG = ast.literal_eval(os.getenv('DEBUG', 'False'))
SECRET_KEY = os.getenv('SECRET_KEY', '#vdoy$8tv)5k06)o(+@hyjbvhw^4$q=ub0whn*@k*1s9wwnv9i')



ADMINS = (
    ('Gavin Fleming', 'gavin@kartoza.com'),
    ('Frank Sokolic', 'frank@gis-solutions.co.za'),
    ('Ismail Sunni', 'ismail@kartoza.com')
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

# Additional locations of static files
STATICFILES_DIRS = (
    absolute_path('minisass', 'static'),
    absolute_path('minisass_frontend', 'static'),
    absolute_path('minisass_frontend', 'src', 'dist'),
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
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
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
            os.path.join(PROJECT_PATH, 'templates'),
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
]

ROOT_URLCONF = 'minisass.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'minisass.wsgi.application'

# email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('SMTP_HOST', 'smtp')
EMAIL_PORT = os.getenv('SMTP_PORT', '25')
EMAIL_HOST_USER = os.getenv('SMTP_HOST_USER', 'noreply@kartoza.com')
EMAIL_HOST_PASSWORD = os.getenv('SMTP_HOST_PASSWORD', 'docker')
EMAIL_USE_TLS = os.getenv('SMTP_EMAIL_TLS', 'False')

SERVER_EMAIL = os.environ.get('SMTP_EMAIL', 'noreply@kartoza.com')
CONTACT_US_RECEPIENT_EMAIL = 'amy@kartoza.com'

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
    'django.contrib.admin',
    'django.contrib.gis',
    # custom apps here:
    'rest_framework',
    'rest_framework_simplejwt',
    'minisass_frontend',
    'minisass_authentication',
    'monitor',
    'minisass'
]


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
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
