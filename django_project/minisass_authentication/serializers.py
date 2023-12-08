from rest_framework import serializers
from django.contrib.auth.models import User
from minisass_authentication.models import Lookup

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    organization_type = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    old_password = serializers.SerializerMethodField()
    new_password = serializers.SerializerMethodField()
    confirm_password = serializers.SerializerMethodField()

    def get_organization_type(self, instance):
        return instance.user_profile.organization_type.description

    def get_organization_name(self, instance):
        return instance.user_profile.organisation_name

    def get_country(self, instance):
        return instance.user_profile.country

    def get_old_password(self, instance):
        return ''

    def get_new_password(self, instance):
        return ''

    def get_confirm_password(self, instance):
        return ''

    class Meta:
        model = User
        fields = (
            'username', 'email', 'first_name', 'last_name', 'organization_type',
            'organization_name', 'country', 'old_password', 'new_password', 'confirm_password',
        )
        extra_kwargs = {'password': {'write_only': True}}


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LookupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lookup
        fields = '__all__'
