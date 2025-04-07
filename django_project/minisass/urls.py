from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
from django.views.i18n import JavaScriptCatalog
from minisass.views import (
    GroupScoresListView,
    VideoListView,
    GetMobileApp,
    get_announcements
)
from minisass_frontend.views import ReactBaseView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


schema_view = get_schema_view(
   openapi.Info(
      title="miniSASS API's",
      default_version='v1',
      description="Description of API's",
      terms_of_service="minisass.org",
      contact=openapi.Contact(email=""),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

admin.autodiscover()

urlpatterns = [
    path('group-scores/', GroupScoresListView.as_view(), name='group-scores'),
    path('videos/', VideoListView.as_view(), name='video-list'),
    path('mobile-app/', GetMobileApp.as_view(), name='get-mobile-app'),
    path('announcements/', get_announcements, name='get_announcements'),

    path('jsi18n/<str:packages>/', JavaScriptCatalog.as_view(), name='javascript-catalog'),  # Use JavaScriptCatalog directly
    path('admin/', admin.site.urls),

    # Serve static files
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),

    # Make the home path the default URL
    path("", ReactBaseView.as_view(), name="home"),

    # Include authentication URLs
    path('authentication/', include('minisass_authentication.urls')),

    # Indlude monitor URLs
    path('monitor/', include('monitor.urls')),

    # map frontend urls to backend
    path("map/", ReactBaseView.as_view(template_name="react_base.html"), name="map"),
    path("password-reset/", ReactBaseView.as_view(template_name="react_base.html"), name="password_reset"),
    path("howto/", ReactBaseView.as_view(template_name="react_base.html"), name="how_to"),
    path("recent-activity/", ReactBaseView.as_view(template_name="react_base.html"), name="recent_activity"),

    # google analytics path
    # re_path('djga/', include('google_analytics.urls')),

    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
        re_path(r'^minio-media/(?P<path>.*)$', serve, {'document_root': settings.MINIO_ROOT, 'show_indexes': True}),
    ]
