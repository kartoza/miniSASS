from django import forms
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

from cmsplugin_contact.nospam.widgets import RecaptchaChallenge, RecaptchaResponse
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
    qs = Lookup.objects.raw("SELECT * FROM minisass_registration_lookup WHERE container_id='8' AND active ='t' ORDER BY rank = 0, rank" )
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
            help_text=_(u"Please select a country"))

    recaptcha_challenge_field = forms.CharField(widget=RecaptchaChallenge)
    recaptcha_response_field = forms.CharField(
                widget = RecaptchaResponse,
                label = _('Please enter the letters/digits you see in the image :'),
                error_messages = {
                    'required': _('You did not enter any of the words.')
            })
    recaptcha_always_validate = False


    def __init__(self, request, *args, **kwargs):
        # Because the ReCAPTCHA library requires the fields to be named a
        # certain way, using a form prefix will break the validation unless we
        # modify the received POST and rename the keys accordingly
        self._request = request
        if ('data' in kwargs or len(args) > 1) and 'prefix' in kwargs:
            data = kwargs.get('data', args[1]).__copy__()
            data['%s-recaptcha_challenge_field' % kwargs['prefix']] = \
                data.pop('recaptcha_challenge_field', [u''])[0]
            data['%s-recaptcha_response_field' % kwargs['prefix']] = \
                data.pop('recaptcha_response_field', [u''])[0]
            data._mutable = False
            # Since data could have been passed eith as an arg or kwarg, set
            # the right one to the new data
            if 'data' in kwargs:
                kwargs['data'] = data
            else:
                args = (args[0], data) + args[2:]
        super(miniSASSregistrationForm, self).__init__(*args, **kwargs)
        self._recaptcha_public_key = getattr(self, 'recaptcha_public_key', getattr(settings, 'RECAPTCHA_PUBLIC_KEY', None))
        self._recaptcha_private_key = getattr(self, 'recaptcha_private_key', getattr(settings, 'RECAPTCHA_PRIVATE_KEY', None))
        self._recaptcha_theme = getattr(self, 'recaptcha_theme', getattr(settings, 'RECAPTCHA_THEME', 'clean'))
        self.fields['recaptcha_response_field'].widget.public_key = self._recaptcha_public_key
        self.fields['recaptcha_response_field'].widget.theme = self._recaptcha_theme
        # Move the ReCAPTCHA fields to the end of the form
        self.fields['recaptcha_challenge_field'] = self.fields.pop('recaptcha_challenge_field')
        self.fields['recaptcha_response_field'] = self.fields.pop('recaptcha_response_field')
        self.fields['username'].help_text = \
                _(u"Public username (don't use any spaces)")
        self.fields['username'].error_messages={'invalid': _("The username may only contain letters, numbers and @, fullstop, plus, minus or underscore characters. NO SPACES.")}
        self.fields['email'].help_text = _(u"Kept confidential")
        self.fields['organisation_type'].choices = _get_organisation_types()
        self.fields['country'].choices = _get_countries()
        self.fields.keyOrder = [
            'username',
            'firstname', 'lastname',
            'email',
            'organisation_type',
            'organisation_name',
            'country',
            'password1',
            'password2',
            'recaptcha_challenge_field',
            'recaptcha_response_field'
        ]

    def clean_recaptcha_response_field(self):
        if 'recaptcha_challenge_field' in self.cleaned_data:
            self._validate_captcha()
        return self.cleaned_data['recaptcha_response_field']

    def clean_recaptcha_challenge_field(self):
        if 'recaptcha_response_field' in self.cleaned_data:
            self._validate_captcha()
        return self.cleaned_data['recaptcha_challenge_field']
    
    def _validate_captcha(self):
        if not self.recaptcha_always_validate:
            rcf = self.cleaned_data['recaptcha_challenge_field']
            rrf = self.cleaned_data['recaptcha_response_field']
            if rrf == '':
                raise forms.ValidationError(_('You did not enter the two words shown in the image.'))
            else:
                from recaptcha.client import captcha as recaptcha
                ip = self._request.META['REMOTE_ADDR']
                check = recaptcha.submit(rcf, rrf, self._recaptcha_private_key, ip)
                if not check.is_valid:
                    raise forms.ValidationError(_('The words you entered did not match the image.'))
