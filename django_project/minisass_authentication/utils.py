from minisass_authentication.models import UserProfile
from minisass_authentication.serializers import UpdatePasswordSerializer


def get_is_user_password_enforced(user, password):
    if not UserProfile.objects.filter(user=user).exists():
        return False

    try:
        UpdatePasswordSerializer(
            context={
                'user': user,
                'do_history_check': False
            }
        ).validate_password(password)
    except Exception:
        return False

    return True
