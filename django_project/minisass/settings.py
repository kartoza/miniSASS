import ast
import os
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

BASE_DIR = Path(__file__).resolve().parent.parent

MINISASS_FRONTEND_PATH = BASE_DIR / 'app'

STATICFILES_DIRS = [
    MINISASS_FRONTEND_PATH / 'src' / 'dist',
    MINISASS_FRONTEND_PATH / 'static'
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
            MINISASS_FRONTEND_PATH / 'templates'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'sekizai.context_processors.sekizai',
            ],
        },
    },
]

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

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.common.CommonMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
]

ROOT_URLCONF = 'minisass.urls'

WSGI_APPLICATION = 'minisass.wsgi.application'

LANGUAGES = [
    ('en', 'English')
]

ADMIN_LANGUAGE_CODE = 'en'

CMS_TEMPLATES = [
    ('site_page.html', 'Site Page'),
    ('map_page.html', 'Map Page'),
    ('resource_page.html', 'Resources Page'),
    ('footer_content.html', 'Footer Content Only'),
]

CMS_PLACEHOLDER_CONF = {
    'links': {
        'plugins': ['LinkPlugin'],
        'name': gettext("Links"),
        'limits': {'LinkPlugin': 10},
    },
    'bottom-links': {
        'plugins': ['LinkPlugin'],
        'name': gettext("Bottom of Page Links"),
        'limits': {'LinkPlugin': 7},
    }
}

CMS_PLUGIN_CONTEXT_PROCESSORS = []
CMS_PLUGIN_PROCESSORS = []
CMS_APPHOOKS = [
    'monitor.cms_app.MonitorApp',
]

PLACEHOLDER_FRONTEND_EDITING = True

CMS_UNIHANDECODE_HOST = None
CMS_UNIHANDECODE_VERSION = None

CMS_MEDIA_PATH = 'cms/'
CMS_MEDIA_ROOT = MEDIA_ROOT / CMS_MEDIA_PATH
CMS_MEDIA_URL = MEDIA_URL + CMS_MEDIA_PATH
CMS_PAGE_MEDIA_PATH = 'cms_page_media/'

CMS_URL_OVERWRITE = True
CMS_MENU_TITLE_OVERWRITE = False
CMS_REDIRECTS = False
CMS_SOFTROOT = False

CMS_PERMISSIONS = True
CMS_RAW_ID_USERS = True
CMS_PUBLIC_FOR = 'all'

CMS_SHOW_START_DATE = False
CMS_SHOW_END_DATE = False
CMS_SEO_FIELDS = False

CMS_CACHE_DURATIONS = {
    'content': 60,
    'menus': 3600,
    'permissions': 3600
}

CMS_CACHE_PREFIX = 'minisass-prod'
CMS_MAX_PAGE_PUBLISH_REVERSIONS = 25

RECAPTCHA_PUBLIC_KEY = os.environ['RECAPTCHA_PUBLIC_KEY']
RECAPTCHA_PRIVATE_KEY = os.environ['RECAPTCHA_PRIVATE_KEY']

TINYMCE_DEFAULT_CONFIG = {
   'theme': 'simple',
   'relative_urls': False,
   'width': 800,
   'height': 600,
   'resize': True
}

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
    # 'registration',
    # 'tinymce',
    # 'cms',
    # 'mptt',
    # 'easy_thumbnails',
    # 'menus',
    # 'sekizai',
    # 'cms.plugins.link',
    # 'cmsplugin_plaintext',
    # 'cms.plugins.text',
    # 'filer',
    # 'cmsplugin_filer_file',
    # 'cmsplugin_filer_folder',
    # 'cmsplugin_filer_image',
    # 'cmsplugin_filer_teaser',
    # 'cmsplugin_filer_video',
    # 'cms.plugins.twitter',
    # 'monitor',
    # 'minisass_registration',
    'rest_framework',
    'rest_framework_simplejwt',
    'minisass_frontend',
    'minisass_authentication'
]


# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
