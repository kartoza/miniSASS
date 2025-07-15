import pycountry
import json
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.conf import settings
from constance import config
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
        ctx['YOMA_AUTH_URL'] = (
            f"{config.YOMA_BASE_URI}/auth/realms/yoma/protocol/openid-connect/auth"
            f"?client_id={config.YOMA_CLIENT_ID}"
            f"&redirect_uri={config.YOMA_REDIRECT_URI}"
            "&response_type=code"
            "&scope=openid+email+profile+yoma-api+phone"
        )
        return ctx
