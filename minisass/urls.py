from django.conf.urls import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'minisass.views.home', name='home'),
    # url(r'^minisass/', include('minisass.foo.urls')),
    (r'^monitor/', include('monitor.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # django-cms urls
    url(r'^', include('cms.urls')),

)

if settings.DEBUG:
    urlpatterns = patterns('',
            url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
                {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
            url(r'', include('django.contrib.staticfiles.urls')),
            ) + urlpatterns
