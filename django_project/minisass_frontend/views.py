import pycountry
import json
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.conf import settings
from minisass.models import PrivacyPolicy
from minisass_authentication.utils import get_user_privacy_consent


class ReactBaseView(TemplateView):
    template_name = "react_base.html"

    def get_context_data(self, **kwargs):
        ctx = super(ReactBaseView, self).get_context_data(
            **kwargs
        )
        ctx['dev_mode'] = settings.DEBUG
        ctx['GOOGLE_ANALYTICS_TRACKING_CODE'] = settings.GOOGLE_ANALYTICS_TRACKING_CODE
        countries_dict = [{'title': country.name, 'value': country.alpha_2} for country in pycountry.countries]
        ctx['COUNTRIES_DICT'] = json.dumps(countries_dict)
        priv_pol = PrivacyPolicy.objects.order_by('-version').first()
        ctx['PRIVACY_POLICY_VERSION'] = priv_pol.version if priv_pol else None
        return ctx
