from django.core.cache import caches
from django.core.cache.backends.locmem import LocMemCache
from django.core.exceptions import ImproperlyConfigured
from django.db import IntegrityError
from django.db import OperationalError
from django.db import ProgrammingError
from django.db import transaction
from django.db.models.signals import post_save

from constance import config
from constance import settings
from constance import signals
from constance.backends.database import DatabaseBackend
from constance.codecs import dumps
from constance.codecs import loads


class EncryptedDatabaseBackend(DatabaseBackend):
    def __init__(self):
        from minisass.models.models import EncryptedConstance

        self._model = EncryptedConstance
        self._prefix = settings.DATABASE_PREFIX
        self._autofill_timeout = settings.DATABASE_CACHE_AUTOFILL_TIMEOUT
        self._autofill_cachekey = 'autofilled'

        if self._model._meta.app_config is None:
            raise ImproperlyConfigured(
                "The constance.backends.database app isn't installed "
                "correctly. Make sure it's in your INSTALLED_APPS setting."
            )

        if settings.DATABASE_CACHE_BACKEND:
            self._cache = caches[settings.DATABASE_CACHE_BACKEND]
            if isinstance(self._cache, LocMemCache):
                raise ImproperlyConfigured(
                    'The CONSTANCE_DATABASE_CACHE_BACKEND setting refers to a '
                    f"subclass of Django's local-memory backend ({settings.DATABASE_CACHE_BACKEND!r}). Please "
                    'set it to a backend that supports cross-process caching.'
                )
        else:
            self._cache = None
        self.autofill()
        # Clear simple cache.
        post_save.connect(self.clear, sender=self._model)