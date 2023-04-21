from django.conf.urls.defaults import *

from minisass_registration.views import school_names


urlpatterns = patterns(
    '',
    url(r'^school_names/$', school_names),
)

