import factory
from django.utils import timezone
from minisass.models import PrivacyPolicy, PrivacyPolicyConsent
from minisass_authentication.tests.factories import UserFactory


class PrivacyPolicyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PrivacyPolicy

    version = factory.Sequence(lambda n: f'v{n}')
    published_at = factory.LazyFunction(timezone.now)


class PrivacyPolicyConsentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PrivacyPolicyConsent

    user = factory.SubFactory(UserFactory)
    privacy_policy = factory.SubFactory(PrivacyPolicyFactory)
    consent_given = True
    timestamp = factory.LazyFunction(timezone.now)
