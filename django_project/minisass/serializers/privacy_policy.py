from rest_framework import serializers
from minisass.models.privacy_policy import PrivacyPolicy, PrivacyPolicyConsent

class PrivacyPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicy
        fields = ['id', 'version', 'link', 'file', 'published_at']

class PrivacyPolicyConsentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicyConsent
        fields = ['id', 'user', 'policy', 'consent_given', 'consent_date', 'ip_address']
        read_only_fields = ['id', 'user', 'consent_date', 'ip_address']
