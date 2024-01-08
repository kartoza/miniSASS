from django.contrib.auth import get_user_model
from minisass_authentication.models import UserProfile, Lookup
import factory

class UserFactory(factory.django.DjangoModelFactory):
    """Factory class for User models."""

    class Meta:
        model = get_user_model()

    username = factory.Faker('user_name')
    password = factory.Faker('password')
    email = factory.Faker('email')


class LookupFactory(factory.django.DjangoModelFactory):
    """Factory class for Lookup models."""

    class Meta:
        model = Lookup

    description = factory.Sequence(lambda n: f'Lookup {n}')


class UserProfileFactory(factory.django.DjangoModelFactory):
    """Factory class for User Profile models."""

    class Meta:
        model = UserProfile

    organisation_type = factory.SubFactory(LookupFactory)
    organisation_name = factory.Sequence(lambda n: f'Organisation {n}')
    user = factory.SubFactory(UserFactory)
