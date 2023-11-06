from django.http import HttpResponse
from django.views.generic import View
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.translation import ugettext as _

# Comment out the UserProfile and Observations imports
# from monitor.models import Observations
# from minisass_authentication.models import UserProfile

class DecimalEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

class ObservationsView(View):
    def get(self, request, *args, **kwargs):
        recent_observations = []

        json_data = simplejson.dumps(recent_observations, cls=DecimalEncoder)
        return HttpResponse(json_data, content_type='application/json')
