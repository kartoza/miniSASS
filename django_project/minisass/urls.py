from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView
from django.views.i18n import JavaScriptCatalog

admin.autodiscover()

urlpatterns = [
    path('jsi18n/<str:packages>/', JavaScriptCatalog.as_view(), name='javascript-catalog'),  # Use JavaScriptCatalog directly
    path('admin/', admin.site.urls),
    
    # Serve static files
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),

    # Make the home path the default URL
    path("", TemplateView.as_view(template_name="react_base.html"), name="home"),

    # Include authentication URLs
    path('authentication/', include('minisass_authentication.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    ]
