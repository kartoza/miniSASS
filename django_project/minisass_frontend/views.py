from django.http import HttpResponse
from django.views.generic import TemplateView
from django.utils import simplejson
from django.views.generic.base import View
from monitor.models import Observations
from minisass_registration.models import UserProfile
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings


class DecimalEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


class ReactHomeView(TemplateView):
    template_name = "react_base.html"

    def get_context_data(self, **kwargs):
        ctx = super(ReactHomeView, self).get_context_data(
            **kwargs
        )
        ctx['dev_mode'] = settings.DEBUG
        return ctx


class ObservationsView(View):
    def get(self, request, *args, **kwargs):
        latest = Observations.objects.all().order_by('-time_stamp')[:20]

        recent_observations = []

        for observation in latest:
            user_profile = UserProfile.objects.get(user=observation.user)

            recent_observations.append({
                'site': observation.site.site_name,
                'username': user_profile.user.username,
                'organisation': user_profile.organisation_name,
                'time_stamp': observation.time_stamp,
                'score': observation.score,
            })

        json_data = simplejson.dumps(
            recent_observations, cls=DecimalEncoder)
        return HttpResponse(json_data, content_type='application/json')
