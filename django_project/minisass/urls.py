from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView
# from cms.sitemaps import CMSSitemap
# from cmsplugin_blog.sitemaps import BlogSitemap
from django.views.i18n import JavaScriptCatalog

urlpatterns = [
    path('jsi18n/<str:packages>/', JavaScriptCatalog.as_view(), name='javascript-catalog'),  # Use JavaScriptCatalog directly
    path('admin/', admin.site.urls),
    
    # path('tinymce/', include('tinymce.urls')),
    # path('sitemap.xml', django.contrib.sitemaps.views.sitemap, {
    #     'sitemaps': {
    #         'cmspages': CMSSitemap,
    #         'blogentries': BlogSitemap
    #     }
    # }),
    
    # Serve static files
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),

    # Add a new URL pattern for /mainPage
    path("home/", TemplateView.as_view(template_name="base.html"), name="home"),

    # Include the URLs of the "myapp" app
    path('authentication/', include('minisass_authentication.urls')),

    # cms urls
    # path('cms/', include('cms.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    ]
