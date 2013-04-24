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
from django.forms.models import modelformset_factory

import urllib2

def index(request):
    """ The 'landing page' for the monitor application 
        Displays a map and handles data input
    """
    
    # Create a form that sends all site data to the view
    Site_Formset = modelformset_factory(Sites)
    sites = Site_Formset(queryset=Sites.objects.all().order_by('name'))

    # Process the POST data, if any
    if request.method == 'POST':
        # Create form instances with the POST data
        site_form = SiteForm(request.POST)
        observation_form = ObservationForm(request.POST)
        coords_form = CoordsForm(request.POST)
        map_form = MapForm(request.POST)
        if (site_form.is_valid() and observation_form.is_valid() and coords_form.is_valid()):
            if request.POST['edit_site'] == 'false':
                # Save the observation only
                observation_form.save()
            else:
                # Save both the site and observation
                current_site = site_form.save()
                current_observation = observation_form.save(commit=False)
                current_observation.site = current_site
                current_observation.save()
            # Create new instances of the forms and then return to the map
            site_form = SiteForm()
            observation_form = ObservationForm(initial={'site':'1'})
            coords_form = CoordsForm()
            post_values = request.POST.copy()
            post_values['edit_site'] = 'true'
            map_form = MapForm(post_values)
            return render_to_response('monitor/index.html', 
                                      {'sites':sites,'site_form':site_form,'observation_form':observation_form,'coords_form':coords_form,'map_form':map_form},
                                      context_instance=RequestContext(request))
        else:
            post_values = request.POST.copy()
            post_values['error'] = 'true'
            map_form = MapForm(post_values)
    else: # create new empty forms
        site_form = SiteForm()
        observation_form = ObservationForm(initial={'site':'1','score':'0.0'})
        coords_form = CoordsForm()
        map_form = MapForm({'zoom_level':'6','centre_X':'2747350','centre_Y':'-3333950','edit_site':'true','error':'false'})
    return render_to_response('monitor/index.html', 
                              {'sites':sites,'site_form':site_form,'observation_form':observation_form,'coords_form':coords_form,'map_form':map_form},
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

def wms_get_feature_info(request, wms_url, wms_params):
    """ Request information from GeoServer via a WMS GetFeatureInfo call
    """
    wms_params.replace('http:/','http://')
    wms_params.replace('///','//')
    feature_info = urllib2.urlopen(wms_url+'?'+wms_params)
    return HttpResponse(feature_info)

