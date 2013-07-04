from registration.backends.default import DefaultBackend
from minisass.forms import miniSASSregistrationForm


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
        return new_user

    def get_form_class(self, request):
        """ Return our new custom registration form
        """
        return miniSASSregistrationForm
