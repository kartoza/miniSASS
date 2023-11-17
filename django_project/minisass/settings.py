# -*- coding: utf-8 -*-
import ast
import os

gettext = lambda s: s
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
allowed_hosts_str = os.getenv('ALLOWED_HOSTS')

if allowed_hosts_str is not None:
    ALLOWED_HOSTS = ast.literal_eval(allowed_hosts_str)
else:
    # allow all for development
    ALLOWED_HOSTS = ['*']

DEBUG = ast.literal_eval(os.getenv('DEBUG', 'False'))
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Gavin Fleming', 'gavin@kartoza.com'),
    ('Frank Sokolic', 'frank@gis-solutions.co.za'),
    ('Ismail Sunni', 'ismail@kartoza.com')
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.getenv('POSTGRES_DB', ''),
        'USER': os.getenv('POSTGRES_USER', ''),
        'PASSWORD': os.getenv('POSTGRES_PASS', ''),
        'HOST': os.getenv('DATABASE_HOST', ''),
        'PORT': os.getenv('DATABASE_PORT', ''),
        'OPTIONS': {'sslmode': 'require'}
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Africa/Johannesburg'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
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

# Define the BASE_DIR setting
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Go up three levels from the BASE_DIR to reach the parent directory
PARENT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(BASE_DIR)))

# Use PARENT_DIR to construct MINISASS_FRONTEND_PATH
FRONTEND_PATH = FRONTEND_DIST_ROOT

# Define the BASE_DIR setting
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Use BASE_DIR to construct MINISASS_FRONTEND_PATH
MINISASS_FRONTEND_PATH = os.path.abspath(os.path.join(PARENT_DIR, 'app'))

# Additional locations of static files
STATICFILES_DIRS = (
    os.path.join(FRONTEND_PATH, 'src', 'dist'),
    os.path.join(FRONTEND_PATH, 'static'),
    os.path.join(MINISASS_FRONTEND_PATH, 'static')
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = os.environ.get('SECRET_KEY', '#vdoy$8tv)5k06)o(+@hyjbvhw^4$q=ub0whn*@k*1s9wwnv9i')

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.i18n',
    # 'django.core.context_processors.debug',
    'django.core.context_processors.request',
    'django.core.context_processors.csrf',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'cms.context_processors.media',
    'sekizai.context_processors.sekizai',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.doc.XViewMiddleware',
    'django.middleware.common.CommonMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
)

ROOT_URLCONF = 'minisass.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'minisass.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_PATH, 'templates'),
    os.path.join(FRONTEND_PATH, 'templates')
)

LANGUAGES = [
    ('en', 'English')
]
ADMIN_LANGUAGE_CODE = 'en'
LANGUAGE_CODE = 'en'

# Django CMS configuration settings
# CMS_LANGUAGES = {
#         '1': [
#             {
#                 'code': 'en',
#                 'name': gettext('English'),
#                 'fallbacks': [],
#                 'public': True,
#                 'hide_untranslated': True,
#                 'redirect_on_fallback': False
#                 }
#             ],
#         'default': {
#             'fallbacks': ['en'],
#             'redirect_on_fallback': True,
#             'public': False,
#             'hide_untranslated': False
#             }
#         }

CMS_TEMPLATES = (
    ('site_page.html', 'Site Page'),
    ('map_page.html', 'Map Page'),
    ('resource_page.html', 'Resources Page'),
    ('footer_content.html', 'Footer Content Only'),
)
CMS_TEMPLATE_INHERITANCE = True

CMS_PLACEHOLDER_CONF = {
    'links': {
            'plugins': ['LinkPlugin'],
            'name': gettext("Links"),
            'limits': {
                'LinkPlugin': 10
                }
            },
    'bottom-links': {
            'plugins': ['LinkPlugin'],
            'name': gettext("Bottom of Page Links"),
            'limits': {
                'LinkPlugin': 7,
                }
            }
    }

CMS_PLUGIN_CONTEXT_PROCESSORS = []
CMS_PLUGIN_PROCESSORS = []
CMS_APPHOOKS = (
    'monitor.cms_app.MonitorApp',
    # 'cmsplugin_blog.cms_app.BlogApphook'
)
PLACEHOLDER_FRONTEND_EDITING = True

CMS_UNIHANDECODE_HOST = None
CMS_UNIHANDECODE_VERSION = None
# CMS_UNIHANDECODE_DECODERS = []
# CMS_UNIHANDECODE_DEFAULT_DECODER = []

CMS_MEDIA_PATH = 'cms/'
CMS_MEDIA_ROOT = MEDIA_ROOT + CMS_MEDIA_PATH
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

# WYM Editor settings
# WYM_TOOLS
# WYM_CONTAINERS
# WYM_CLASSES
# WYM_STYLES
# WYM_STYLESHEET

# filer, easy_thumbnails settings
FILER_DEBUG = False
FILER_ENABLE_LOGGING = True

THUMBNAIL_PROCESSORS = (
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    'filer.thumbnail_processors.scale_and_crop_with_subject_location',
    'easy_thumbnails.processors.filters',
)

# # blog plugin settings
# JQUERY_JS = 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'
# JQUERY_UI_JS = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js'
# JQUERY_UI_CSS = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/themes/smoothness/jquery-ui.css'

# reCAPTCHA keys for minisass.org
RECAPTCHA_PUBLIC_KEY = os.environ.get('RECAPTCHA_PUBLIC_KEY', '')
RECAPTCHA_PRIVATE_KEY = os.environ.get('RECAPTCHA_PRIVATE_KEY', '')

# tiny-MCE settings
TINYMCE_DEFAULT_CONFIG = {
   'theme': 'simple',
   'relative_urls': False,
   'width': 800,
   'height': 600,
   'resize': True
}

# email settings
EMAIL_HOST = os.getenv('SMTP_HOST')
EMAIL_PORT = os.getenv('SMTP_PORT')
DEFAULT_FROM_EMAIL = os.getenv('SMTP_EMAIL')
EMAIL_HOST_USER = os.getenv('SMTP_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('SMTP_HOST_PASSWORD')
EMAIL_USE_TLS = os.getenv('SMTP_EMAIL_TLS')

# django registration/auth settings
ACCOUNT_ACTIVATION_DAYS = 7
LOGIN_REDIRECT_URL = '/'
AUTH_PROFILE_MODULE = "minisass_registration.UserProfile"

SENTRY_KEY = os.environ.get('SENTRY_KEY', '')
if SENTRY_KEY != '':
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    sentry_sdk.init(
        dsn=SENTRY_KEY,
        integrations=[DjangoIntegration()]
    )

# Installed applications
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.gis',
    'django.contrib.sitemaps',
    'registration',
    'tinymce',
    'cms',
    'mptt',
    'easy_thumbnails',
    'menus',
    'south',
    'sekizai',
    'cms.plugins.link',
    'cmsplugin_plaintext',
    'cms.plugins.text',
    'filer',
    'cmsplugin_filer_file',
    'cmsplugin_filer_folder',
    'cmsplugin_filer_image',
    'cmsplugin_filer_teaser',
    'cmsplugin_filer_video',
    'cms.plugins.twitter',
    # 'cmsplugin_blog',
    'cmsplugin_contact',
    'cmsplugin_rssfeed',
    'djangocms_utils',
    'simple_translation',
    'tagging',
    'reversion',
    'monitor',
    'minisass_registration',
    'minisass_frontend'
)

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
