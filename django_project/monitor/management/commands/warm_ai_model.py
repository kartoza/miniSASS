# coding=utf-8
"""Pre-fetch and load the macroinvertebrate image classifier.

The classifier is loaded lazily on first use (see
monitor.observation_views.get_classifier_model), which keeps worker startup cheap
but means the first upload to hit it pays the S3 download plus the Keras load.
That can exceed the uwsgi ``harakiri`` timeout.

Run this after deploying, or before serving traffic, to warm the on-disk cache:

    python manage.py warm_ai_model

Exits non-zero if the model cannot be loaded, so it is usable as a health gate.
"""

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    """Download and load the AI classifier so the first request is fast."""

    help = 'Pre-fetch and load the macroinvertebrate image classifier model.'

    def handle(self, *args, **options):
        # Imported here rather than at module scope so that merely loading the
        # command (e.g. by "manage.py help") does not pull in TensorFlow.
        from monitor.observation_views import (
            AI_MODEL_FILE_NAME,
            get_classifier_model,
        )

        self.stdout.write(f'Fetching and loading {AI_MODEL_FILE_NAME} ...')
        model = get_classifier_model()
        if model is None:
            raise CommandError(
                'Classifier model could not be loaded. Check that '
                '<MINIO_BUCKET>/%s exists in the bucket named by MINIO_AI_BUCKET, '
                'and that the AWS credentials can read it.' % AI_MODEL_FILE_NAME
            )
        self.stdout.write(self.style.SUCCESS('Classifier model loaded and cached.'))
