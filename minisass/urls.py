from django.conf import settings

from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.conf.urls.i18n import i18n_patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from cms.sitemaps import CMSSitemap
from cmsplugin_blog.sitemaps import BlogSitemap

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^jsi18n/(?P<packages>\S+?)/$', 'django.views.i18n.javascript_catalog'),
)


urlpatterns += staticfiles_urlpatterns()

urlpatterns += i18n_patterns('',
    # Examples:
    # url(r'^$', 'minisass.views.home', name='home'),
    # url(r'^minisass/', include('minisass.foo.urls')),
    (r'^tinymce/', include('tinymce.urls')),
    # (r'^monitor/', include('monitor.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # registration urls
    url(r'^accounts/', include('minisass.backends.urls')),

    # django-cms urls
    url(r'^', include('cms.urls')),

    # site map
    url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {
        'sitemaps': {
            'cmspages': CMSSitemap,
            'blogentries': BlogSitemap
        }
    }),

)

if settings.DEBUG:
    urlpatterns = patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        # url(r'', include('django.contrib.staticfiles.urls')),
    ) + urlpatterns
