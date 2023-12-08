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
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    organisation_type = serializers.SerializerMethodField()
    organisation_name = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    old_password = serializers.SerializerMethodField()
    password = serializers.SerializerMethodField()
    confirm_password = serializers.SerializerMethodField()

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

    class Meta:
        model = User
        fields = (
            'username', 'email', 'first_name', 'last_name', 'organisation_type',
            'organisation_name', 'country', 'old_password', 'password', 'confirm_password',
        )
        extra_kwargs = {'password': {'write_only': True}}


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LookupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lookup
        fields = '__all__'
