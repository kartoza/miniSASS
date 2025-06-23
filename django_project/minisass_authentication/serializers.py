from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from django.contrib.auth.models import User
from minisass_authentication.models import Lookup, UserProfile, PasswordHistory, PENDING_STATUS
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user_id = validated_data.pop('id', None)

        if user_id:
            existing_user = User.objects.filter(id=user_id).first()

            if existing_user:
                return existing_user

        # If user doesn't exist or no id provided, create a new user
        user = User.objects.create_user(id=user_id, **validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(required=False, source='id')
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=True)
    name = serializers.CharField(source='first_name')
    surname = serializers.CharField(source='last_name')
    organisation_type = serializers.CharField(source='userprofile.organisation_type.description', required=False, allow_null=True)
    organisation_name = serializers.CharField(source='userprofile.organisation_name', required=False, allow_null=True)
    country = serializers.CharField(source='userprofile.country', required=False, allow_null=True)
    is_expert = serializers.SerializerMethodField()
    upload_preference = serializers.CharField(source='userprofile.upload_preference', required=True, allow_null=False)

    def get_is_expert(self, obj):
        try:
            return obj.userprofile.is_expert
        except Exception:
            return False

    def validate_name(self, value):
        if value == '':
            raise serializers.ValidationError("Name should not be empty")
        return value

    def validate_surname(self, value):
        if value == '':
            raise serializers.ValidationError("Surname should not be empty")
        return value

    def save(self, old_user):
        user_dict = self.validated_data
        user_profile_dict = self.validated_data.pop('userprofile', {})

        organisation_type_desc = user_profile_dict.get('organisation_type', {}).get('description', None)
        organisation_name = user_profile_dict.get('organisation_name', '')
        country = user_profile_dict.get('country', '')
        upload_preference = user_profile_dict.get('upload_preference', 'wifi')

        User.objects.filter(id=old_user.id).update(**user_dict)
        
        organisation_type = None
        if organisation_type_desc:
            try:
                organisation_type = Lookup.objects.get(description__iexact=organisation_type_desc)
            except Lookup.DoesNotExist:
                organisation_type, _ = Lookup.objects.get_or_create(description=organisation_type_desc)
        
        defaults = {
            'organisation_name': organisation_name,
            'country': country,
            'upload_preference': upload_preference
        }
        if organisation_type:
            defaults['organisation_type'] = organisation_type

        user_profile, created = UserProfile.objects.update_or_create(
            user=old_user,
            defaults=defaults
        )
        return old_user, user_profile

    class Meta:
        model = User
        fields = (
            'user_id', 'username', 'email', 'name', 'surname',
            'organisation_type', 'organisation_name', 'country', 'is_expert', 'upload_preference'
        )



class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('certificate',)

    def save(self, old_user):
        certificate = self.validated_data['certificate']
        defaults = {}
        if certificate:
            defaults['certificate'] = certificate
            defaults['is_expert'] = False
            defaults['expert_approval_status'] = PENDING_STATUS
        user_profile, created = UserProfile.objects.update_or_create(
            user=old_user,
            defaults=defaults
        )
        return user_profile


class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        password_match = check_password(value, self.context.get('old_password', ''))
        if not password_match:
            raise serializers.ValidationError('Wrong old password')
        return value

    def validate_password(self, value):
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
        if any(remaining_requirements.values()):
            missing_criteria = ', '.join([key for key, val in remaining_requirements.items() if val])
            raise serializers.ValidationError(f'Missing password criteria: {missing_criteria}')

        do_history_check = self.context.get('do_history_check', True)
        if do_history_check:
            is_password_used = PasswordHistory.is_password_used(
                self.context['user'], value
            )
            if is_password_used:
                raise serializers.ValidationError(
                    'This password has been used before. Please choose a new and unique password.'
                )
        return value

    def validate_confirm_password(self, value):
        if self.context['password'] != value:
            raise serializers.ValidationError('Confirmed password is not same as new password.')
        return value

    def save(self, user):
        user.set_password(self.validated_data['password'])
        user.save()
        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'is_password_enforced': True
            }
        )
        return user

    class Meta:
        fields = (
            'old_password', 'password', 'confirm_password',
        )


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LookupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lookup
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
