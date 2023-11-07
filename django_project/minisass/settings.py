import os
import ast
from pathlib import Path


gettext = lambda s: s
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')
SECRET_KEY = os.environ.get('SECRET_KEY', '#vdoy$8tv)5k06)o(+@hyjbvhw^4$q=ub0whn*@k*1s9wwnv9i')
DEBUG = ast.literal_eval(os.getenv('DEBUG', 'True'))
ADMINS = [
    ('Gavin Fleming', 'gavin@kartoza.com'),
    ('Frank Sokolic', 'frank@gis-solutions.co.za'),
    ('Ismail Sunni', 'ismail@kartoza.com')
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['POSTGRES_DB'],
        'USER': os.environ['POSTGRES_USER'],
        'PASSWORD': os.environ['POSTGRES_PASS'],
        'HOST': os.environ['DATABASE_HOST'],
        'PORT': os.environ['DATABASE_PORT'],
        'OPTIONS': {'sslmode': 'require'}
    }
}

TIME_ZONE = 'Africa/Johannesburg'
LANGUAGE_CODE = 'en'
SITE_ID = 1

USE_I18N = True
USE_L10N = True
USE_TZ = True

MEDIA_ROOT = os.getenv('MEDIA_ROOT', 'media/')
MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
STATIC_ROOT = os.getenv('STATIC_ROOT', 'static/')
STATIC_URL = os.getenv('STATIC_URL', '/static/')


PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

# Define the BASE_DIR setting
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Go up three levels from the BASE_DIR to reach the parent directory
PARENT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(BASE_DIR)))

# Use PARENT_DIR to construct MINISASS_FRONTEND_PATH
FRONTEND_PATH = os.path.abspath(os.path.join(PARENT_DIR, 'app'))

# Define the BASE_DIR setting
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Additional locations of static files
STATICFILES_DIRS = (
    os.path.join(FRONTEND_PATH, 'src', 'dist'),
    os.path.join(FRONTEND_PATH, 'static')
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(FRONTEND_PATH, 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
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

WSGI_APPLICATION = 'minisass.wsgi.application'

EMAIL_HOST = os.environ['SMTP_HOST']
EMAIL_PORT = os.environ['SMTP_PORT']
DEFAULT_FROM_EMAIL = os.environ['SMTP_EMAIL']
EMAIL_HOST_USER = os.environ['SMTP_HOST_USER']
EMAIL_HOST_PASSWORD = os.environ['SMTP_HOST_PASSWORD']
EMAIL_USE_TLS = ast.literal_eval(os.environ['SMTP_EMAIL_TLS'])

ACCOUNT_ACTIVATION_DAYS = 7
LOGIN_REDIRECT_URL = '/'
AUTH_PROFILE_MODULE = "minisass_authentication.UserProfile"

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.gis',
    'django.contrib.sitemaps',
    # custom apps here:
    'minisass_frontend',
    'minisass_authentication',
    'rest_framework',
    'rest_framework_simplejwt',
]


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
