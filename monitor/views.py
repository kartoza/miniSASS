# Create your views here.
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from monitor.forms import *
from monitor.models import Sites, Observations
from django.forms.models import inlineformset_factory

def index(request):
    """ The 'landing page' for the monitor application 
    
    Will display a map
    """

    # render the home page
    return render_to_response('monitor/index.html', 
                              context_instance=RequestContext(request))

def data_input(request, site_id=None):
    """ Will display the miniSASS data entry screen
    """
    if site_id == None:
        site = Sites()
    else:
        site = Sites.objects.get(gid=site_id)

    Observation_Formset = inlineformset_factory(Sites, Observations, form=ObservationForm)

    if request.method == 'POST':
        # create form instances with the POST data
        site_form = SiteForm(request.POST, instance=site)
        coords_form = CoordsForm(request.POST)
        data = {
            'form-TOTAL_FORMS': u'1',
            'form-INITIAL_FORMS': u'0',
            'form-MAX_NUM_FORMS': u'',
            }
        observation_form = Observation_Formset(request.POST, instance=site)
        if (site_form.is_valid() and coords_form.is_valid() and observation_form.is_valid()):
            site_form.save()
            observation_form.save()
            return HttpResponseRedirect('/monitor/')
    else: # display a either a new empty form or a form for editing
        site_form = SiteForm(instance=site)
        coords_form = CoordsForm()
        observation_form = Observation_Formset(instance=site)
    return render_to_response('monitor/data_input.html', 
                                  {'site_form':site_form,'coords_form':coords_form,'observation_form':observation_form},
                                  context_instance=RequestContext(request))

def observations(request):
    """ Will display the list of most current miniSASS observation reports
    """

    observations = models.observations.objects.all().order_by('-time_stamp')[:10]

    # render the home page
    return render_to_response('monitor/observations.html', 
                              {'observations':observations}, 
                              context_instance=RequestContext(request))

def detail(request, monitor_id):
    """ miniSASS observation detail view
    """
    try:
        observation = models.Observations.objects.get(pk=monitor_id)
    except models.Observations.DoesNotExist:
        raise Http404

    return render_to_response('monitor/detail.html',
                              {'observation':observation},
                              context_instance=RequestContext(request))

