from datetime import timedelta
from django.utils.timezone import now
from minisass_authentication.models import UserProfile
from minisass_authentication.serializers import UpdatePasswordSerializer
from minisass.models.privacy_policy import PrivacyPolicy, PrivacyPolicyConsent
from minisass.serializers.privacy_policy import PrivacyPolicySerializer, PrivacyPolicyConsentSerializer
from rest_framework_simplejwt.tokens import RefreshToken


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


def create_long_lived_refresh_token(user, days=90):
	refresh = RefreshToken.for_user(user)
	refresh.set_exp(lifetime=timedelta(days=days))
	return refresh


def generate_user_response(user, app='web'):
    access_token = RefreshToken.for_user(user).access_token

    # Check if first name is "Anonymous"
    if user.first_name == "Anonymous":
        is_profile_updated = False
        has_consented = True
    else:
        is_profile_updated = True
        has_consented = get_user_privacy_consent(user)

    priv_pol = PrivacyPolicy.objects.order_by("-published_at").first()
    priv_pol_ver = priv_pol.version if priv_pol else None

    if app == 'mobile':
        refresh_token = str(create_long_lived_refresh_token(user, days=90))
    else:
        refresh_token = str(create_long_lived_refresh_token(user, days=30))

    user_data = {
        'username': user.username,
        'email': user.email,
        'access_token': str(access_token),
        'refresh_token': refresh_token,
        'is_authenticated': True,
        'user_id': user.pk,
        'is_admin': user.is_staff if user.is_authenticated else None,
        'is_profile_updated': is_profile_updated,
        'is_agreed_to_privacy_policy': has_consented,
        'accepted_privacy_policy_version': priv_pol_ver
    }
    return user_data