import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils.timezone import now
from minisass.models.privacy_policy import PrivacyPolicy, PrivacyPolicyConsent
from minisass.serializers.privacy_policy import PrivacyPolicySerializer, PrivacyPolicyConsentSerializer


class PrivacyPolicyConsentStatusView(APIView):
    """
    GET /privacy-policy/check/

    Returns whether the authenticated user has given consent to the latest version
    of the privacy policy. Also returns details about the latest policy version.

    Response:
    {
        "has_consented": true|false,
        "policy": {
            "id": 1,
            "version": "v1.3",
            "link": "https://example.com/policy/v1.3",
            "file": null,
            "published_at": "2025-04-09T07:00:00Z"
        }
    }
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        latest_policy = PrivacyPolicy.objects.order_by("-published_at").first()
        if not latest_policy:
            return Response({"detail": "No privacy policy available."}, status=404)

        has_consented = PrivacyPolicyConsent.objects.filter(
            user=request.user,
            policy=latest_policy,
            consent_given=True
        ).exists()

        return Response({
            "has_consented": has_consented,
            "policy": PrivacyPolicySerializer(latest_policy).data
        })

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication

# @method_decorator(csrf_exempt, name='dispatch')
class PrivacyPolicyConsentCreateView(APIView):
    """
    POST /privacy-policy/consent/

    Records the authenticated user's consent to a specific privacy policy version.

    Request body:
    {
        "policy_id": 1
    }

    Response (201 Created):
    {
        "id": 10,
        "user": 1,
        "policy": 1,
        "consent_given": true,
        "consent_date": "2025-04-09T10:44:00Z",
        "ip_address": "127.0.0.1"
    }

    Errors:
    - 400: if the user already gave consent
    - 404: if the policy does not exist
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        agree = request.data.get("agree", False)
        try:
            policy = PrivacyPolicy.objects.order_by("-published_at").first()
        except PrivacyPolicy.DoesNotExist:
            return Response({"detail": "Privacy policy not found."}, status=404)

        if PrivacyPolicyConsent.objects.filter(user=request.user, policy=policy).exists():
            return Response({"detail": "Consent already recorded."}, status=400)

        consent = PrivacyPolicyConsent.objects.create(
            user=request.user,
            policy=policy,
            consent_given=agree,
            consent_date=now(),
            ip_address=request.META.get("REMOTE_ADDR")
        )

        return Response(PrivacyPolicyConsentSerializer(consent).data, status=status.HTTP_201_CREATED)
