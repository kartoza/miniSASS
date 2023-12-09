from minisass_authentication.models import UserProfile


def get_is_user_password_enforced(user):
    if not UserProfile.objects.filter(user=user).exists():
        return False
    return user.user_profile.is_password_enforced
