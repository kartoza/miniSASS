from django.core.mail import send_mail
from registration.backends.default import DefaultBackend

from minisass_registration.forms import miniSASSregistrationForm
from minisass_registration.models import UserProfile, Lookup


class miniSASSbackend(DefaultBackend):
    """ This class uses a custom registration form that includes fields for
        name, surname and organisations.
    """

    def register(self, request, **kwargs):
        """
        This method also stores the firstname, lastname and organisation fields
        collected from the custom registration form.
        """
        # Save the new user
        new_user = super(miniSASSbackend, self).register(request, **kwargs)
        new_user.first_name = kwargs['firstname']
        new_user.last_name = kwargs['lastname']
        new_user.save()

        # Save the user profile
        organisation_type = Lookup.objects.get(pk=kwargs['organisation_type'])
        country = Lookup.objects.get(pk=kwargs['country'])
        profile = UserProfile.objects.create(
                user=new_user,
                organisation_type=organisation_type,
                organisation_name=kwargs['organisation_name'],
                country=country)
        profile.save()

        # send an email to info@minisass.org
        send_mail(
                "New miniSASS user registration",
                """Dear miniSASS admin,

This is to notify you that a new user, %s, registered on the miniSASS website.

Kind regards,
minisass.org
""" % new_user.get_full_name(),
                'admin@minisass.org',
                ['info@minisass.org'],
                fail_silently=False)

        return new_user

    def get_form_class(self, request):
        """ Return our new custom registration form
        """
        return miniSASSregistrationForm
