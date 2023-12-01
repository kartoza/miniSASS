from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class CustomTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return str(user.pk) + str(timestamp) + str(user.is_active) + str(user.date_joined)

    def make_token(self, user, duration='days', count=7):
        if duration == 'hours':
            expiration_time = timezone.now() + timedelta(hours=count)
        else:
            expiration_time = timezone.now() + timedelta(days=count)

        return {
            'token': self._make_token_with_timestamp(user, expiration_time),
            'expiration_time': expiration_time,
        }

custom_token_generator = CustomTokenGenerator()
