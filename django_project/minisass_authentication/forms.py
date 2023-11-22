from django import forms
from django.utils.translation import gettext_lazy as _
from minisass_authentication.models import Lookup

def get_organisation_types():
    result = [('','-- Select a Type --')]
    qs = Lookup.objects.filter(container__description='Organisation Type', active=True).order_by('rank', 'description')
    result.extend([(itm.id, itm.description) for itm in qs])
    return result

def get_organisation_names():
    return []

def get_countries():
    result = [('','-- Select a Country --')]
    qs = Lookup.objects.raw("SELECT * FROM minisass_registration_lookup WHERE container_id='8' AND active ='t' ORDER BY rank = 0, rank, description" )
    result.extend([(itm.id, itm.description) for itm in qs])
    return result

def get_countries_old():
    result = [('','-- Select a Country --')]
    qs = Lookup.objects.filter(container__description='Country', active=True).order_by('rank', 'description')
    result.extend([(itm.id, itm.description) for itm in qs])
    return result

class MiniSASSRegistrationForm(forms.Form):
    """ Add fields for firstname, lastname, and organisation
    """
    firstname = forms.CharField(
        label=_("Name"),
        max_length=30,
        help_text=_("Kept confidential")
    )
    lastname = forms.CharField(
        label=_("Surname"),
        max_length=30,
        help_text=_("Kept confidential")
    )
    organisation_type = forms.ChoiceField(
        label=_("Organisation Type"),
        required=True,
        help_text=_("Please select an organisation type, or private individual"),
        choices=get_organisation_types()
    )
    organisation_name = forms.CharField(
        label=_("Organisation Name"),
        max_length=50,
        help_text=_("Please check if the school is already listed, then add if not."),
        required=False
    )
    country = forms.ChoiceField(
        label=_("Country"),
        required=False,
        help_text=_("Please select a country"),
        choices=get_countries()
    )

    def clean(self):
        cleaned_data = super().clean()
        organisation_type = cleaned_data.get('organisation_type')
        organisation_name = cleaned_data.get('organisation_name')

        # You can add custom validation here if needed

        return cleaned_data
