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
from monitor.models import Sites, Observations, Schools
from django.forms.models import modelformset_factory
from django.db import connection
import urllib2

def index(request):
    """ The 'landing page' for the monitor application 
        Displays a map and handles data input
    """
    
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
            observation_form = ObservationForm(initial={'site':'1','score':'0.0'})
            coords_form = CoordsForm()
            post_values = request.POST.copy()
            post_values['edit_site'] = 'true'
            map_form = MapForm(post_values)
            return render_to_response('monitor/index.html', 
                                      {'site_form':site_form,'observation_form':observation_form,'coords_form':coords_form,'map_form':map_form},
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
                              {'site_form':site_form,'observation_form':observation_form,'coords_form':coords_form,'map_form':map_form},
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
    feature_info = urllib2.urlopen('http://'+wms_url+'?'+wms_params)
    return HttpResponse(feature_info)

def get_sites(request, x, y, d):
    """ Request all sites within distance (d) of x;y. Use a distance of -9
        to request all sites.
    """
    select_clause = 'SELECT gid, ST_X(the_geom) as x, ST_Y(the_geom) as y, river_name, site_name, description, river_cat, date(time_stamp) AS time_stamp FROM sites'
    order_clause = ' ORDER BY river_name, site_name, time_stamp ASC'
    if (d == '-9'):
        where_clause = ''
    else:
        query_envelope = str(float(x)-float(d))+','+str(float(y)-float(d))+','+str(float(x)+float(d))+','+str(float(y)+float(d))
        where_clause = ' WHERE ST_DWithin(ST_Transform(sites.the_geom,3857),ST_MakeEnvelope('+query_envelope+',3857),'+d+')'

    sites_returned = Sites.objects.raw(select_clause + where_clause + order_clause)
    return render_to_response('monitor/sites.html',
                              {'sites':sites_returned},
                              context_instance=RequestContext(request))

def get_schools(request):
    """ Request all schools with names starting with the letters in the search_str
    """

    search_str = request.GET['query']
    schools_returned = Schools.objects.filter(school__istartswith=search_str).order_by('school')
     
    return render_to_response('monitor/schools.html',
                              {'schools':schools_returned},
                              context_instance=RequestContext(request))

def zoom_observation(request, obs_id):
    """ Zoom to a miniSASS observation - Find the coordinates for an observation obs_id, convert them
        to Google projection coordinates and then return a map_form containing these coordinates
    """

    observation = Observations.objects.get(pk=obs_id)
    # Select statement converts coordinates to Google projection
    select_stmt = 'SELECT gid, ST_X(ST_Transform(the_geom,3857)) as x, ST_Y(ST_Transform(the_geom,3857)) as y FROM sites WHERE gid = %s'
    cursor = connection.cursor()
    cursor.execute(select_stmt % (observation.site_id,))
    site = cursor.fetchone()
    site_form = SiteForm()
    observation_form = ObservationForm(initial={'site':'1','score':'0.0'})
    coords_form = CoordsForm()
    map_form = MapForm({'zoom_level':'15','centre_X':site[1],'centre_Y':site[2],'edit_site':'true','error':'false'})
    return render_to_response('monitor/index.html', 
                              {'site_form':site_form,'observation_form':observation_form,'coords_form':coords_form,'map_form':map_form},
                              context_instance=RequestContext(request))


