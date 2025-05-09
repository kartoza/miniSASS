from django.utils.timezone import now
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
    if user.is_anonymous:
        return True
    latest_policy = PrivacyPolicy.objects.order_by("-published_at").first()
    if not latest_policy:
        return True

    consents = PrivacyPolicyConsent.objects.filter(
        user=user,
        policy=latest_policy
    )

    if not consents.exists():
        return False
    else:
        consent = consents.first()
        return consent.consent_given


def create_privacy_policy_consent(request, user):
    agree = request.data.get("agree", False)
    policy = PrivacyPolicy.objects.order_by("-published_at").first()
    if not policy:
        return None

    consent, _ = PrivacyPolicyConsent.objects.get_or_create(
        user=user,
        policy=policy,
        defaults={
            'consent_given': agree,
            'consent_date': now(),
            'ip_address': request.META.get("REMOTE_ADDR")
        }
    )
    consent.consent_given = agree
    consent.consent_date = now()
    consent.ip_address = request.META.get("REMOTE_ADDR")
    consent.save()

    return consent