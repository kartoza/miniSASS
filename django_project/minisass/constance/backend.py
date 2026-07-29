import logging

from cryptography.exceptions import InvalidSignature
from cryptography.fernet import InvalidToken
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


logger = logging.getLogger(__name__)


class EncryptedDatabaseBackend(DatabaseBackend):
    """Constance backend whose values are encrypted at rest.

    The stored values are encrypted with a key derived from settings.SECRET_KEY,
    so rotating SECRET_KEY makes every existing value undecryptable.

    That has already caused a full outage. ReactBaseView reads three of these
    values on every render, and it serves "/", "/map/", "/howto/" and
    "/recent-activity/", so an unhandled decryption error returned 500 for the
    entire site. The ALB health check probes a static endpoint and kept passing, so
    nothing detected it and the deployment circuit breaker had no reason to
    intervene.

    A value that cannot be decrypted is therefore now treated as unset. Constance
    falls back to the default declared in CONSTANCE_CONFIG when a backend returns
    None, so the site keeps serving with the feature degraded rather than failing
    outright. The error is logged loudly because the underlying problem still needs
    fixing: after a key rotation the affected values must be re-entered.
    """

    def get(self, key):
        try:
            return super().get(key)
        except (InvalidToken, InvalidSignature):
            logger.error(
                'Could not decrypt constance value %r. Its stored value was '
                'encrypted with a different SECRET_KEY, so the configured default '
                'is being used instead. Re-enter this value in the admin to '
                'restore it.', key, exc_info=True,
            )
            return None

    def mget(self, keys):
        """Same protection for the bulk read used by autofill."""
        try:
            yield from super().mget(keys)
        except (InvalidToken, InvalidSignature):
            logger.error(
                'Could not decrypt one or more constance values; falling back to '
                'defaults. Re-enter them in the admin.', exc_info=True,
            )

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