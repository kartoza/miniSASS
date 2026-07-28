# coding=utf-8
"""Storage indirection for model file fields.

Model fields must reference :func:`minio_storage` rather than
``settings.MINION_STORAGE`` directly.

Django serialises a ``FileField``'s ``storage`` argument into migrations. Passing
the storage *instance* made ``makemigrations`` write the live AWS access key and
secret key, in plaintext, into a migration file destined for version control::

    storage=MinisassS3Storage(access_key='AKIA...', secret_key='...', ...)

A callable is serialised by reference instead, so migrations contain only
``minisass.storage.minio_storage`` and no credentials. Django evaluates it lazily,
which also means the storage follows the current settings at runtime rather than
whatever was captured when the migration was written.
"""

from django.conf import settings


def minio_storage():
    """Return the configured object storage backend."""
    return settings.MINION_STORAGE
