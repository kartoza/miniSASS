from django import forms
from django.utils.translation import ugettext_lazy as _

from registration.forms import RegistrationForm

from minisass_registration.models import Lookup


def _get_organisation_types():
    result = [('','-- Select a Type --')]
    qs = Lookup.objects.filter(
        container__description='Organisation Type',
        active=True)
    qs = qs.order_by('rank', 'description')
    result.extend([(itm.id, itm.description,) for itm in qs])
    return result


def _get_organisation_names():
    return []


class miniSASSregistrationForm(RegistrationForm):
    """ Add fields for firstname, lastname and organisation
    """

    firstname = forms.CharField(
            label=_("Name"), 
            max_length=30)
    lastname = forms.CharField(
            label=_("Surname"), 
            max_length=30)
    organisation_type = forms.ChoiceField(
            label=_("Organisation Type"),
            required=True, 
            choices=_get_organisation_types())
    organisation_name = forms.CharField(
            label=_("Organisation Name"), 
            max_length=50,
            required=False)

    def __init__(self, *args, **kwargs):
        super(miniSASSregistrationForm, self).__init__(*args, **kwargs)
        self.fields.keyOrder = [
            'username',
            'firstname', 'lastname',
            'email',
            'organisation_type',
            'organisation_name',
            'password1',
            'password2'
        ]
