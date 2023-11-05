from django.core.mail import send_mail
from registration.backends.default import DefaultBackend
from minisass_authentication.forms import miniSASSregistrationForm
from minisass_authentication.models import UserProfile, Lookup

class miniSASSbackend(DefaultBackend):
    """ This class uses a custom registration form that includes fields for
        name, surname, and organizations.
    """

    def register(self, request, **kwargs):
        """
        This method also stores the firstname, lastname, and organization fields
        collected from the custom registration form.
        """
        # Save the new user
        new_user = super().register(request, **kwargs)
        new_user.first_name = kwargs['firstname']
        new_user.last_name = kwargs['lastname']
        new_user.save()

        # Save the user profile
        organisation_type = Lookup.objects.get(pk=kwargs['organisation_type'])
        try:
            country = Lookup.objects.get(pk=kwargs['country'])
        except ValueError:
            country = None
        profile = UserProfile.objects.create(
            user=new_user,
            organisation_type=organisation_type,
            organisation_name=kwargs['organisation_name'],
            country=country)
        profile.save()

        # send an email to info@minisass.org
        send_mail(
            "New miniSASS user registration",
            f"""Dear miniSASS admin,

This is to notify you that a new user, {new_user.get_full_name()}, registered on the miniSASS website.

Kind regards,
minisass.org
""",
            'info@minisass.org',
            ['info@minisass.org'],
            fail_silently=False,
        )

        return new_user

    def get_form_class(self, request):
        """ Return our new custom registration form
        """
        return miniSASSregistrationForm
