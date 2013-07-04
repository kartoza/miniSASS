from django import forms
from django.utils.translation import ugettext_lazy as _

from registration.forms import RegistrationForm


class miniSASSregistrationForm(RegistrationForm):
    """ Add fields for firstname, lastname and organisation
    """
    firstname = forms.CharField(label=_("Name"), max_length=30)
    lastname = forms.CharField(label=_("Surname"), max_length=30)

    def __init__(self, *args, **kwargs):
        super(miniSASSregistrationForm, self).__init__(*args, **kwargs)
        self.fields.keyOrder = [
            'username',
            'firstname',
            'lastname',
            'email',
            'password1',
            'password2'
        ]
