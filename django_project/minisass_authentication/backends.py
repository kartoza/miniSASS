# backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model


class EmailBackend(ModelBackend):
    """Authenticate with an email address instead of a username.

    Note the deliberate call to ``user_can_authenticate``. Without it this backend
    happily authenticated users whose ``is_active`` flag was False, which silently
    defeated the entire activation-by-email flow: an account that had never
    followed its activation link could still log in.

    It also made the two login paths disagree, since
    ``/authentication/api/token/`` goes through the stock ``ModelBackend``, which
    does perform the check, and so returned 401 for the very account that
    ``/authentication/api/login/`` accepted.

    Reinstating the check means any account still sitting at ``is_active=False``
    loses access. Accounts stranded during the period when outbound email was not
    working must be activated first::

        python manage.py activate_stranded_users --since 2026-04-06 --dry-run
        python manage.py activate_stranded_users --since 2026-04-06
    """

    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        except UserModel.MultipleObjectsReturned:
            # Email is not unique at the database level. Refuse rather than
            # guessing which account was intended.
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
