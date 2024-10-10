from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from datetime import timedelta

class Command(BaseCommand):
	help = 'Manually generate a special token for a given user email'

	def add_arguments(self, parser):
		parser.add_argument('email', type=str, help="The user's email for whom the token should be generated")

	def handle(self, *args, **kwargs):
		email = kwargs['email']

		try:
			user = User.objects.get(email=email)
		except User.DoesNotExist:
			self.stdout.write(self.style.ERROR(f"User with email {email} not found"))
			return
		
		# Generate token for the user
		token = AccessToken.for_user(user)
		# Set token expiry to 100 years
		token.set_exp(lifetime=timedelta(days=365 * 100))

		# Output the token in the console
		self.stdout.write(self.style.SUCCESS(f"Generated token for {email}: {str(token)}"))
