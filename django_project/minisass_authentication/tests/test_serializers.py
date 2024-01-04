from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from minisass_authentication.serializers import UpdatePasswordSerializer


class TestUpdatePasswordSerializer(APITestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.new_password = 'newpassword123'
        self.user.set_password(self.new_password)
        self.user.save()

    def test_validate(self):
        """
        Test validating password update payload.
        """

        payload = {
            'password': self.new_password,
            'old_password': 'aaaa',
            'confirm_password': self.new_password
        }
        serializer = UpdatePasswordSerializer(
            data=payload,
            context={
                'old_password': self.user.password,
                'user': self.user
            }
        )
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            self.assertTrue('Wrong old password' in str(e))
            self.assertTrue('Password has been used' in str(e))
