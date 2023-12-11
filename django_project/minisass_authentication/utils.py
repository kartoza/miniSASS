from minisass_authentication.models import UserProfile


def get_is_user_password_enforced(user):
    if not UserProfile.objects.filter(user=user).exists():
        return False
    return UserProfile.objects.filter(user=user).first().is_password_enforced
