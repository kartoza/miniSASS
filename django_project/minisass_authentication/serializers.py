from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from django.contrib.auth.models import User
from minisass_authentication.models import Lookup, UserProfile
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    name = serializers.CharField(source='first_name')
    surname = serializers.CharField(source='last_name')
    organisation_type = serializers.CharField(source='userprofile.organisation_type.description')
    organisation_name = serializers.CharField(source='userprofile.organisation_name')
    country = serializers.CharField(source='userprofile.country')
    old_password = serializers.SerializerMethodField()
    password = serializers.SerializerMethodField()
    confirm_password = serializers.SerializerMethodField()
    certificate = serializers.SerializerMethodField()

    def get_name(self, instance):
        return instance.first_name

    def get_surname(self, instance):
        return instance.last_name

    def get_organisation_type(self, instance):
        return instance.userprofile.organisation_type.description

    def get_organisation_name(self, instance):
        return instance.userprofile.organisation_name

    def get_country(self, instance):
        return instance.userprofile.country

    def get_old_password(self, instance):
        return ''

    def get_password(self, instance):
        return ''

    def get_confirm_password(self, instance):
        return ''

    def get_certificate(self, instance):
        return instance.userprofile.certificate.url

    @classmethod
    def validate_old_password_correct(self, value, compare_value):
        password_match = check_password(value, compare_value)
        return password_match

    @classmethod
    def validate_password_criteria(self, value):
        requirements = {
            'uppercase': re.compile(r'^(?=.*[A-Z])'),
            'lowercase': re.compile(r'^(?=.*[a-z])'),
            'digit': re.compile(r'^(?=.*\d)'),
            'specialCharacter': re.compile(r'^(?=.*[@$!%*?&])'),
            'length': re.compile(r'^.{6,}$'),
        }
        remaining_requirements = {
            'uppercase': not requirements['uppercase'].search(value),
            'lowercase': not requirements['lowercase'].search(value),
            'digit': not requirements['digit'].search(value),
            'specialCharacter': not requirements['specialCharacter'].search(value),
            'length': not requirements['length'].search(value),
        }
        return (
            not all(remaining_requirements.values()),
            ', '.join([key for key, val in remaining_requirements.items() if val])
        )

    def validate_name(self, value):
        if value == '':
            raise serializers.ValidationError("Name should not be empty")
        return value

    def validate_surname(self, value):
        if value == '':
            raise serializers.ValidationError("Surname should not be empty")
        return value

    def validate_organisation_type(self, value):
        if value == '':
            raise serializers.ValidationError("Organisation Type should not be empty")
        return value

    def validate_organisation_name(self, value):
        if value == '':
            raise serializers.ValidationError("Organisation Name should not be empty")
        return value

    def validate_country(self, value):
        if value == '':
            raise serializers.ValidationError("Country should not be empty")
        return value

    def save(self, old_user, certificate=None):
        user_dict = self.validated_data
        user_profile_dict = self.validated_data.pop('userprofile')
        User.objects.filter(id=old_user.id).update(**user_dict)

        try:
            organisation_type = Lookup.objects.get(
                description__iexact=user_profile_dict['organisation_type']['description']
            )
        except Lookup.DoesNotExist:
            # If no match is found, use the default description "Organisation Type".
            organisation_type = Lookup.objects.get(description__iexact="Organisation Type")

        defaults = {
            'organisation_type': organisation_type,
            'organisation_name': user_profile_dict['organisation_name'],
            'country': user_profile_dict['country']
        }
        if certificate:
            defaults['certificate'] = certificate
            defaults['is_expert'] = True
        user_profile, created = UserProfile.objects.update_or_create(
            user=old_user,
            defaults=defaults
        )
        return old_user, user_profile

    class Meta:
        model = User
        fields = (
            'username', 'email', 'name', 'surname', 'organisation_type',
            'organisation_name', 'country', 'old_password', 'password', 'confirm_password',
            'certificate'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'old_password': {'write_only': True},
            'confirm_password': {'write_only': True}
        }


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LookupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lookup
        fields = '__all__'
