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


def _get_countries():
    result = [('','-- Select a Country --')]
    qs = Lookup.objects.filter(
        container__description='Country',
        active=True)
    qs = qs.order_by('rank', 'description')
    result.extend([(itm.id, itm.description,) for itm in qs])
    return result


class miniSASSregistrationForm(RegistrationForm):
    """ Add fields for firstname, lastname and organisation
    """

    firstname = forms.CharField(
            label=_("Name"), 
            max_length=30,
            help_text=_(u"Kept confidential"))
    lastname = forms.CharField(
            label=_("Surname"), 
            max_length=30,
            help_text=_(u"Kept confidential"))
    organisation_type = forms.ChoiceField(
            label=_("Organisation Type"),
            required=True, 
            choices=_get_organisation_types(),
            help_text=_(u"Please select an organisation type, \
                    or private individual"))
    organisation_name = forms.CharField(
            label=_("Organisation Name"), 
            max_length=50,
            help_text=_(u"Please check if school already listed, \
                    then add if not."),
            required=False)
    country = forms.ChoiceField(
            label=_("Country"),
            required=False, 
            choices=_get_countries(),
            help_text=_(u"Please select a country"))

    def __init__(self, *args, **kwargs):
        super(miniSASSregistrationForm, self).__init__(*args, **kwargs)
        self.fields['username'].help_text = \
                _(u"Public username (don't use any spaces)")
        self.fields['email'].help_text = _(u"Kept confidential")
        self.fields.keyOrder = [
            'username',
            'firstname', 'lastname',
            'email',
            'organisation_type',
            'organisation_name',
            'country',
            'password1',
            'password2'
        ]
