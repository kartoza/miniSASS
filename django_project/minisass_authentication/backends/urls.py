from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

from registration.views import activate
from minisass_authentication.views import register
from django.urls import include



urlpatterns = patterns(
    '',
    url(r'^activate/complete/$',
        direct_to_template,
        {'template': 'registration/activation_complete.html'},
        name='registration_activation_complete'),
    url(r'^activate/(?P<activation_key>\w+)/$',
        activate,
        {'backend': 'minisass_registration.backends.miniSASSbackend'},
        name='registration_activate'),
    url(r'^register/$',
        register,
        {'backend': 'minisass_registration.backends.miniSASSbackend'},
        name='registration_register'),
    url(r'^register/complete/$',
        direct_to_template,
        {'template': 'registration/registration_complete.html'},
        name='registration_complete'),
    url(r'^register/closed/$',
        direct_to_template,
        {'template': 'registration/registration_closed.html'},
        name='registration_disallowed'),
    (r'', include('registration.auth_urls')),
)
