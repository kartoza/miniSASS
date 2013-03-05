# Create your views here.
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.core.paginator import Paginator, InvalidPage, EmptyPage

from monitor import models

def index(request):
    """ The 'landing page' for the monitor application 
    
    Will display the list of most current miniSASS reports
    """

    monitors = models.miniSASSmonitor.objects.all().order_by('-date_created')[:10]

    # render the home page
    return render_to_response('monitor/index.html', 
                              {'monitors':monitors}, 
                              context_instance=RequestContext(request))


def detail(request, monitor_id):
    """ miniSASS monitor detail view
    """
    try:
        monitor = models.miniSASSmonitor.objects.get(pk=monitor_id)
    except models.miniSASSmonitor.DoesNotExist:
        raise Http404

    return render_to_response('monitor/detail.html',
                              {'monitor':monitor},
                              context_instance=RequestContext(request))
