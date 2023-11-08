from datetime import timedelta
from pathlib import Path
import os


ALLOWED_HOSTS = ['*']

DEBUG = os.getenv('DEBUG', 'True').lower() == 'True'

SECRET_KEY = os.getenv('SECRET_KEY', '#vdoy$8tv)5k06)o(+@hyjbvhw^4$q=ub0whn*@k*1s9wwnv9i')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB',''),
        'USER': os.getenv('POSTGRES_USER',''),
        'PASSWORD': os.getenv('POSTGRES_PASS',''),
        'HOST': os.getenv('DATABASE_HOST',''),
        'PORT': os.getenv('DATABASE_PORT',22),
        'OPTIONS': {'sslmode': 'require'}
    }
}

TIME_ZONE = 'Africa/Johannesburg'
LANGUAGES = [
    ('en', 'English')
]
ADMIN_LANGUAGE_CODE = 'en'
LANGUAGE_CODE = 'en'
SITE_ID = 1

USE_I18N = True
USE_L10N = True
USE_TZ = True

MEDIA_ROOT = os.getenv('MEDIA_ROOT', 'media/')
MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
STATIC_ROOT = os.getenv('STATIC_ROOT', 'static/')
STATIC_URL = os.getenv('STATIC_URL', '/static/')


PROJECT_PATH = Path(__file__).resolve().parent.parent

# Define the BASE_DIR setting
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Go up three levels from the BASE_DIR to reach the parent directory for container
PARENT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(BASE_DIR)))

# Use PARENT_DIR to construct MINISASS_FRONTEND_PATH
FRONTEND_PATH = os.path.abspath(os.path.join(PARENT_DIR, 'app'))

# Additional locations of static files
STATICFILES_DIRS = (
    os.path.join(FRONTEND_PATH, 'src', 'dist'),
    os.path.join(FRONTEND_PATH, 'static'),
    os.path.join(PROJECT_PATH, 'minisass', 'static'),
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


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(FRONTEND_PATH, 'templates'),
            os.path.join(PROJECT_PATH, 'minisass_authentication', 'templates')
        ],
        'OPTIONS': {
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
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

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    # custom apps here:
    'rest_framework',
    'rest_framework_simplejwt',
    'minisass_frontend',
    'minisass_authentication'
]
