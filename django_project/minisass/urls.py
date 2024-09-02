from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView
from django.views.i18n import JavaScriptCatalog
from minisass.views import (
    GroupScoresListView,
    VideoListView,
    GetMobileApp,
    get_announcements
)

from minisass_frontend.views import ReactHomeView

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
    path("", ReactHomeView.as_view(), name="home"),

    # Include authentication URLs
    path('authentication/', include('minisass_authentication.urls')),

    # Indlude monitor URLs
    path('monitor/', include('monitor.urls')),

    # map frontend urls to backend
    path("map/", TemplateView.as_view(template_name="react_base.html"), name="map"),
    path("password-reset/", TemplateView.as_view(template_name="react_base.html"), name="password_reset"),
    path("howto/", TemplateView.as_view(template_name="react_base.html"), name="how_to"),
    path("recent-activity/", TemplateView.as_view(template_name="react_base.html"), name="recent_activity"),

    # google analytics path
    # re_path('djga/', include('google_analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
        re_path(r'^minio-media/(?P<path>.*)$', serve, {'document_root': settings.MINIO_ROOT, 'show_indexes': True}),
    ]
