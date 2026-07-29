# coding=utf-8
"""Health and readiness endpoints.

Two deliberately different checks:

``/health/`` (liveness)
    Returns 200 unconditionally. Answers only "is this process accepting
    connections". Cheap enough to poll frequently.

``/health/ready/`` (readiness)
    Actually exercises the dependencies a page render needs, and is what the load
    balancer should target.

Why readiness exists at all: a deployment once returned 500 on every page while
the load balancer reported the task perfectly healthy, because the health check
only probed a static endpoint. The task passed, traffic was shifted onto it, and
the deployment circuit breaker had no reason to intervene. A check that does not
touch what the application actually needs cannot detect that the application is
broken.
"""

import logging

from django.db import connection
from django.http import JsonResponse

logger = logging.getLogger(__name__)


def liveness(request):
    """Is the process up? Nothing more."""
    return JsonResponse({'status': 'ok'})


def readiness(request):
    """Can this instance actually serve a page?

    Checks, in order of how often each has broken in practice:

    1. the database answers a query,
    2. the encrypted constance settings can be read, which is the check that would
       have caught the SECRET_KEY rotation outage, and
    3. the built frontend bundle is present, since a missing manifest renders a
       blank page while every endpoint still returns 200.

    Returns 503 with a per-check breakdown when anything fails, so the load
    balancer takes the instance out of service instead of serving errors.
    """
    checks = {}

    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
            cursor.fetchone()
        checks['database'] = 'ok'
    except Exception as error:
        checks['database'] = f'error: {type(error).__name__}'

    try:
        # Reading these decrypts values whose key derives from SECRET_KEY. The
        # backend degrades to defaults rather than raising, so assert we got a
        # usable value instead of merely that no exception escaped.
        from constance import config
        if config.YOMA_BASE_URI:
            checks['settings'] = 'ok'
        else:
            checks['settings'] = 'error: constance value empty'
    except Exception as error:
        checks['settings'] = f'error: {type(error).__name__}'

    try:
        from django.template.loader import render_to_string
        render_to_string('react_base.html', {
            'dev_mode': False,
            'GOOGLE_ANALYTICS_TRACKING_CODE': '',
            'PRIVACY_POLICY_VERSION': None,
            'COUNTRIES_DICT': '[]',
            'YOMA_AUTH_URL': '',
        })
        checks['frontend'] = 'ok'
    except Exception as error:
        checks['frontend'] = f'error: {type(error).__name__}'

    healthy = all(value == 'ok' for value in checks.values())
    if not healthy:
        logger.error('Readiness check failed: %s', checks)

    return JsonResponse(
        {'status': 'ok' if healthy else 'unhealthy', 'checks': checks},
        status=200 if healthy else 503,
    )
