# coding=utf-8
"""Activate accounts that could never receive their activation email.

Outbound email was not functional for a period, so people who registered during it
never received an activation link and their accounts remain ``is_active=False``.
They could still log in only because minisass_authentication.backends.EmailBackend
was skipping the active check. Now that the check is reinstated, those accounts
would be locked out, so activate them explicitly.

Always preview first::

    python manage.py activate_stranded_users --since 2026-04-06 --dry-run
    python manage.py activate_stranded_users --since 2026-04-06
"""

from datetime import datetime

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone


class Command(BaseCommand):
    help = (
        'Activate inactive accounts created on or after a date, for users who '
        'never received an activation email.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--since', required=True,
            help='Only accounts registered on or after this date (YYYY-MM-DD).')
        parser.add_argument(
            '--dry-run', action='store_true',
            help='List what would change without writing anything.')

    def handle(self, *args, **options):
        try:
            since = datetime.strptime(options['since'], '%Y-%m-%d')
        except ValueError:
            raise CommandError('--since must be formatted as YYYY-MM-DD.')
        since = timezone.make_aware(since, timezone.get_current_timezone())

        User = get_user_model()
        stranded = User.objects.filter(
            is_active=False, date_joined__gte=since).order_by('date_joined')

        count = stranded.count()
        if not count:
            self.stdout.write('No inactive accounts found in that period.')
            return

        self.stdout.write(
            f'{count} inactive account(s) registered on or after '
            f'{since.date()}:')
        for user in stranded:
            self.stdout.write(
                f'  {user.date_joined:%Y-%m-%d}  {user.email}')

        if options['dry_run']:
            self.stdout.write(self.style.WARNING(
                '\nDry run: nothing was changed.'))
            return

        updated = stranded.update(is_active=True)
        self.stdout.write(self.style.SUCCESS(
            f'\nActivated {updated} account(s).'))
