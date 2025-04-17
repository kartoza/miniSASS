from minisass_authentication.models import UserProfile
from minisass_authentication.serializers import UpdatePasswordSerializer
from minisass.models.privacy_policy import PrivacyPolicy, PrivacyPolicyConsent
from minisass.serializers.privacy_policy import PrivacyPolicySerializer, PrivacyPolicyConsentSerializer


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


def get_user_privacy_consent(user):
    latest_policy = PrivacyPolicy.objects.order_by("-published_at").first()
    if not latest_policy:
        return True

    consents = PrivacyPolicyConsent.objects.filter(
        user=user,
        policy=latest_policy
    )

    if not consents.exists():
        return None
    else:
        consent = consents.first()
        return consent.consent_given
