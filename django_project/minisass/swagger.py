# coding=utf-8
"""Swagger/OpenAPI metadata.

This lives outside the settings module on purpose.

``drf_yasg.openapi`` cannot be imported from ``minisass/settings/default.py``:

* imported at the top of that module, it pulls in ``rest_framework``, which reads
  and permanently caches ``settings.REST_FRAMEWORK`` before that setting has been
  defined. DRF then silently runs its own defaults for the life of the process, so
  JWT is not the default authentication class, ``BasicAuthentication`` stays
  enabled, and throttle rates and ``NUM_PROXIES`` have no effect.
* imported lower down, after ``REST_FRAMEWORK`` exists, it fails outright with
  ``AppRegistryNotReady``, because resolving the JWT authentication class imports
  Django's auth models while the app registry is still loading.

drf_yasg accepts ``DEFAULT_INFO`` as a dotted path to an ``openapi.Info``
instance, which defers the import until the apps are ready. Settings therefore
reference ``'minisass.swagger.api_info'`` rather than importing anything.
"""

from drf_yasg import openapi

api_info = openapi.Info(
    title="miniSASS API",
    default_version='v1',
    description=(
        "Public API for the miniSASS citizen science platform.\n\n"
        "See https://iwmihq.github.io/miniSASS/developer/ for guides."
    ),
    terms_of_service="https://minisass.org/",
    contact=openapi.Contact(email="info@minisass.org"),
    license=openapi.License(name="GNU Affero General Public License v3"),
)
