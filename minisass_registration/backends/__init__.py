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
        new_user = super(miniSASSbackend, self).register(request, **kwargs)
        new_user.first_name = kwargs['firstname']
        new_user.last_name = kwargs['lastname']
        new_user.save()

        organisation_type = Lookup.objects.get(pk=kwargs['organisation_type'])
        profile = UserProfile.objects.create(
                user=new_user,
                organisation_type=organisation_type,
                organisation_name=kwargs['organisation_name'])
        profile.save()

        return new_user

    def get_form_class(self, request):
        """ Return our new custom registration form
        """
        return miniSASSregistrationForm
