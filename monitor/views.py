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


def get_email_content(observation, new_site=False):
    """Helper function to create email content based on observation and user.

    :param observation: The Observation.
    :type observation: Observations

    :param new_site: Flag whether the observation for new site or not.
    :type new_site: bool

    :returns: An email content to be sent.
    :rtype: str
    """
    if new_site:
        email_sub_content = 'new observation and site'
    else:
        email_sub_content = 'new observation'
    email_content = '''
Dear %s,

Thank you for your %s submission.

Site Details:
River name: %s
Site name: %s
Site Description: %s
Category: %s

Observation Details:
Date: %s
Collector's name: %s
Comments/notes: %s


Your observation still needs to be verified and you may contacted in this \
regard.

Kind regards,
The miniSASS team.
                ''' % (
        observation.user.get_full_name(),
        email_sub_content,
        observation.site.river_name,
        observation.site.site_name,
        observation.site.description,
        observation.site.river_cat,

        observation.obs_date.strftime("%d %b %Y"),
        observation.user.get_full_name(),
        observation.comment,
    )

    return email_content


def send_email_observation(observation, new_site=False):
    """Helper function to send email content based on observation.

    :param observation: The Observation.
    :type observation: Observations

    :param new_site: Flag whether the observation for new site or not.
    :type new_site: bool
    """
    if new_site:
        email_subject = 'New Site and Observation Submitted'
    else:
        email_subject = 'New Observation Submitted'

    email_content = get_email_content(observation, new_site)

    email_sender = 'info@minisass.org'

    observation.user.email_user(email_subject, email_content, email_sender)


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
                observation = observation_form.save()

                # Send email to the user.
                send_email_observation(observation, new_site=False)

            else:
                # Save both the site and observation
                current_site = site_form.save()
                current_observation = observation_form.save(commit=False)
                current_observation.site = current_site
                current_observation.save()

                # Send email to the user.
                send_email_observation(current_observation, new_site=True)

            # Create new instances of the forms and then return to the map
            site_form = SiteForm()
            observation_form = ObservationForm(initial={'site':'1','score':'0.0'})
            coords_form = CoordsForm()
            post_values = request.POST.copy()
            post_values['saved_obs'] = 'true'
            post_values['edit_site'] = 'true'
            map_form = MapForm(post_values)
            return render_to_response('monitor/index.html',
                                      {'site_form':site_form,'observation_form':observation_form,'coords_form':coords_form,'map_form':map_form},
                                      context_instance=RequestContext(request))
        else:
            post_values = request.POST.copy()
            post_values['error'] = 'true'
            post_values['saved_obs'] = 'false'
            map_form = MapForm(post_values)
    else: # create new empty forms
        site_form = SiteForm()
        observation_form = ObservationForm(initial={'site':'1','score':'0.0'})
        coords_form = CoordsForm()
        map_form = MapForm({'zoom_level':'6','centre_X':'2747350','centre_Y':'-3333950','edit_site':'true','error':'false','saved_obs':'false'})
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
    # Send the WMS parameters as a POST request in order to handle spaces in the CQL filter
    feature_info = urllib2.urlopen('http://'+wms_url, data=wms_params)
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

def get_closest_site(request, x, y, d):
    """ Requests the closest site within distance (d) of x;y.
    """
    xy_point = "ST_PointFromText('POINT(" + x + " " + y + ")', 3857)"
    select_clause = 'SELECT gid, ST_Distance(ST_Transform(sites.the_geom,3857),' + xy_point + ') AS distance FROM sites'
    where_clause = ' WHERE ST_DWithin(ST_Transform(sites.the_geom,3857),'+xy_point+','+d+')'
    site_returned = Sites.objects.raw(select_clause + where_clause + ' ORDER BY distance LIMIT 1;')
    return render_to_response('monitor/closest_site.html',
                              {'site':site_returned},
                              context_instance=RequestContext(request))

def get_unique(request, field):
    """ Request all unique values.
    """
    values_returned = Sites.objects.distinct(field)
    return render_to_response('monitor/unique_values.html',
                              {'values':values_returned},
                              context_instance=RequestContext(request))

def get_schools(request):
    """ Request all schools with names starting with the letters in the search_str
    """

    search_str = request.GET['query']
    schools_returned = Schools.objects.filter(school__istartswith=search_str).order_by('school')

    return render_to_response('monitor/schools.html',
                              {'schools':schools_returned},
                              context_instance=RequestContext(request))


def get_observations(request, site_id):
    """ Request all observations for the requested site ID.
    """
    observations = Observations.objects.filter(site=site_id).order_by('obs_date')

    return render_to_response('monitor/site_observations.html',
                              {'observations':observations},
                              context_instance=RequestContext(request))

def download_observations(request, site_id):
    """ Download all observations for the requested site ID in csv format.
    """
    import csv
    from django.utils.encoding import smart_str

    # Get the site's observations
    observations = Observations.objects.filter(site=site_id)

    # Get the site coordinates
    select_clause = 'SELECT gid, ST_X(the_geom) as x, ST_Y(the_geom) as y FROM sites WHERE gid = ' + site_id
    site_coords = Sites.objects.raw(select_clause)

    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(mimetype='text/csv')
    response['Content-Disposition'] = 'attachment; filename="observations.csv"'
    writer = csv.writer(response, csv.excel)
    response.write(u'\ufeff'.encode('utf8')) # BOM (optional...Excel needs it to open UTF-8 file properly)
    writer.writerow([
        smart_str(u"Obs ID"),
        smart_str(u"User name"),
        smart_str(u"Obs Date"),
        smart_str(u"Site name"),
        smart_str(u"Latitude"),
        smart_str(u"Longitude"),
        smart_str(u"Flatworms"),
        smart_str(u"Worms"),
        smart_str(u"Leeches"),
        smart_str(u"Crabs/shrimps"),
        smart_str(u"Stoneflies"),
        smart_str(u"Minnow mayflies"),
        smart_str(u"Other mayflies"),
        smart_str(u"Damselflies"),
        smart_str(u"Dragonflies"),
        smart_str(u"Bugs/beetles"),
        smart_str(u"Caddisflies"),
        smart_str(u"True flies"),
        smart_str(u"Snails"),
        smart_str(u"Score"),
        smart_str(u"Status"),
        smart_str(u"Water clarity"),
        smart_str(u"Water temp"),
        smart_str(u"pH"),
        smart_str(u"Diss oxygen"),
        smart_str(u"diss oxygen unit"),
        smart_str(u"Elec cond"),
        smart_str(u"Elec cond unit"),
        smart_str(u"Comment"),
    ])
    for obs in observations:
        if obs.flag == 'clean':
            flag = 'Verified'
        else:
            flag = 'Unverified'
        writer.writerow([
            smart_str(obs.pk),
            smart_str(obs.user),
            smart_str(obs.obs_date),
            smart_str(obs.site),
            smart_str(site_coords[0].y),
            smart_str(site_coords[0].x),
            smart_str(obs.flatworms),
            smart_str(obs.worms),
            smart_str(obs.leeches),
            smart_str(obs.crabs_shrimps),
            smart_str(obs.stoneflies),
            smart_str(obs.minnow_mayflies),
            smart_str(obs.other_mayflies),
            smart_str(obs.damselflies),
            smart_str(obs.dragonflies),
            smart_str(obs.bugs_beetles),
            smart_str(obs.caddisflies),
            smart_str(obs.true_flies),
            smart_str(obs.snails),
            smart_str(obs.score),
            smart_str(flag),
            smart_str(obs.water_clarity),
            smart_str(obs.water_temp),
            smart_str(obs.ph),
            smart_str(obs.diss_oxygen),
            smart_str(obs.diss_oxygen_unit),
            smart_str(obs.elec_cond),
            smart_str(obs.elec_cond_unit),
            smart_str(obs.comment),
        ])
    return response

def zoom_observation(request, obs_id):
    """
    Zoom to a miniSASS observation - Find the coordinates for an observation
    obs_id, convert them to Google projection coordinates and then return a
    map_form containing these coordinates
    """

    # observation = Observations.objects.get(pk=obs_id)
    # Select statement converts coordinates to Google projection
    select_stmt = """
        SELECT  s.gid,
                ST_X(ST_Transform(s.the_geom,3857)) as x,
                ST_Y(ST_Transform(s.the_geom,3857)) as y
        FROM    sites s,
                observations o
        WHERE   s.gid = o.site
        and     o.gid = %s;
    """ % obs_id
    cursor = connection.cursor()
    cursor.execute(select_stmt)
    site = cursor.fetchone()
    site_form = SiteForm()
    observation_form = ObservationForm(initial={'site':'1','score':'0.0'})
    coords_form = CoordsForm()
    map_form = MapForm({
        'zoom_level':'15',
        'centre_X':site[1],
        'centre_Y':site[2],
        'edit_site':'true',
        'error':'false'
    })
    return render_to_response('monitor/index.html', {
        'site_form': site_form,
        'observation_form': observation_form,
        'coords_form': coords_form,
        'map_form': map_form
    }, context_instance=RequestContext(request))


