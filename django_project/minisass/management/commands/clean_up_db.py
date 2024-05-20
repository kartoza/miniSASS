from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from minisass_authentication.models import (
  UserProfile,
  PasswordHistory
)
from monitor.models import (
	Observations,
	Sites
)
from django.contrib.sites.models import Site
from django.db.models import F, Count
from django.db.models.functions import TruncDate


class Command(BaseCommand):
	help = 'Merge users with duplicate emails, reassign related objects, and delete specific users/bots'

	def handle(self, *args, **kwargs):
		self.delete_specific_users()
		self.merge_duplicate_users()

	@transaction.atomic
	def delete_specific_users(self):
		# Filter users whose first name is 'James', last name is 'Smith',
		# the date portion of date_joined and last_login are the same, 
		# and date_joined is before January 1, 2023
		users_to_delete = User.objects.annotate(
			date_joined_date=TruncDate('date_joined'),
			last_login_date=TruncDate('last_login')
		).filter(
			first_name='James',
			last_name='Smith',
			date_joined_date=F('last_login_date'),
			date_joined__lt='2023-01-01'
		)

		for user in users_to_delete:
			UserProfile.objects.filter(user=user).delete()
			PasswordHistory.objects.filter(user=user).delete()
			Sites.objects.filter(user=user).delete()
			Observations.objects.filter(user=user).delete()
			user.delete()

		self.stdout.write(self.style.SUCCESS('Successfully deleted specific users based on criteria.'))


	@transaction.atomic
	def merge_duplicate_users(self):
		duplicate_emails = User.objects.values('email').annotate(count=Count('id')).filter(count__gt=1)
		for item in duplicate_emails:
			email = item['email']
			users = User.objects.filter(email=email)
			primary_user = users.first()  # Keep the first user as the primary

			for user in users.exclude(id=primary_user.id):
				# Handle UserProfile
				if UserProfile.objects.filter(user=primary_user).exists():
					UserProfile.objects.filter(user=user).delete()
				else:
					UserProfile.objects.filter(user=user).update(user=primary_user)

				# Handle PasswordHistory
				PasswordHistory.objects.filter(user=user).update(user=primary_user)

				# Handle Sites
				Sites.objects.filter(user=user).update(user=primary_user)

				# Handle Observations
				Observations.objects.filter(user=user).update(user=primary_user)

				# Delete the duplicate user
				user.delete()

			# Ensure email is unique
			primary_user.email = email
			primary_user.save()

			# Send notification email
			self.send_notification_email(primary_user)

		self.stdout.write(self.style.SUCCESS('Successfully merged users with duplicate emails.'))

	def send_notification_email(self, user):
		subject = 'Important: Your miniSASS Accounts Have Been Merged'
		login_url = Site.objects.get_current().domain
		message = render_to_string('duplicate_email_merge_notification.html', {
			'user': user,
			'login_url': login_url,
		})
		send_mail(
			subject,
			message,
			settings.CONTACT_US_RECEPIENT_EMAIL,
			[user.email],
			fail_silently=False,
			html_message=message,
		)
