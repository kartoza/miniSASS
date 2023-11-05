from django.http import Http404, HttpResponse
from django.utils.translation import gettext_lazy as _
from monitor.forms import *
from monitor.models import Sites, Observations, Schools
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.contrib import messages  # For displaying messages to the user
from django.shortcuts import render, get_object_or_404
from monitor.models import Observations  # Import your model class
import requests
from django.db.models import F
from django.db.models.functions import SQRT
from django.shortcuts import render
import csv
from django.utils.encoding import smart_str
from django.db import connection
from monitor.models import Observations, Sites
from monitor.forms import SiteForm, ObservationForm, CoordsForm, MapForm





def get_email_content(observation, new_site=False):
    if new_site:
        email_sub_content = 'new observation and site'
    else:
        email_sub_content = 'new observation'
    email_content = f'''
    Dear {observation.user.get_full_name()},
    
    Thank you for your {email_sub_content} submission.
    
    Site Details:
    River name: {observation.site.river_name}
    Site name: {observation.site.site_name}
    Site Description: {observation.site.description}
    Category: {observation.site.river_cat}
    
    Observation Details:
    Date: {observation.obs_date.strftime("%d %b %Y")}
    Collector's name: {observation.user.get_full_name()}
    Comments/notes: {observation.comment}
    
    Your observation still needs to be verified, and you may be contacted in this regard.
    
    Kind regards,
    The miniSASS team.
    '''
    return email_content

def send_email_observation(observation, new_site=False):
    if new_site:
        email_subject = 'New Site and Observation Submitted'
    else:
        email_subject = 'New Observation Submitted'

    email_content = get_email_content(observation, new_site)
    email_sender = 'info@minisass.org'

    send_mail(email_subject, email_content, email_sender, [observation.user.email])


def index(request):
    # Initialize form instances
    site_form = SiteForm()
    observation_form = ObservationForm(initial={'site': '1', 'score': '0.0'})
    coords_form = CoordsForm()
    map_form = MapForm({'zoom_level': '6', 'centre_X': '2747350', 'centre_Y': '-3333950', 'edit_site': 'true', 'error': 'false', 'saved_obs': 'false'})

    if request.method == 'POST':
        site_form = SiteForm(request.POST)
        observation_form = ObservationForm(request.POST)
        coords_form = CoordsForm(request.POST)
        map_form = MapForm(request.POST)

        if site_form.is_valid() and observation_form.is_valid() and coords_form.is_valid():
            if request.POST.get('edit_site') == 'false':
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

            # Clear forms and display a success message
            site_form = SiteForm()
            observation_form = ObservationForm(initial={'site': '1', 'score': '0.0'})
            coords_form = CoordsForm()
            map_form = MapForm({'zoom_level': '6', 'centre_X': '2747350', 'centre_Y': '-3333950', 'edit_site': 'true', 'error': 'false', 'saved_obs': 'true'})

            # Show a success message
            messages.success(request, 'Observation saved successfully.')

            # Redirect back to the map page
            return redirect('monitor_index')  # Replace 'monitor_index' with your actual URL name

        else:
            # If forms are invalid, display an error message
            messages.error(request, 'Please correct the errors in the form.')

    return render(request, 'monitor/index.html', {
        'site_form': site_form,
        'observation_form': observation_form,
        'coords_form': coords_form,
        'map_form': map_form
    })


def observations(request):
    """ Will display the list of most current miniSASS observation reports
    """

    observations = Observations.objects.order_by('-time_stamp')[:10]

    return render(request, 'monitor/observations.html', {'observations': observations})

def detail(request, monitor_id):
    """ miniSASS observation detail view
    """
    observation = get_object_or_404(Observations, pk=monitor_id)

    return render(request, 'monitor/detail.html', {'observation': observation})


def wms_get_feature_info(request, wms_url, wms_params):
    """ Request information from GeoServer via a WMS GetFeatureInfo call
    """
    # Construct the URL with the provided wms_url
    url = 'http://' + wms_url

    # Send a GET request to the WMS server with the provided parameters
    response = requests.get(url, params=wms_params)

    if response.status_code == 200:
        # If the request was successful, return the response content as an HTTP response
        return HttpResponse(response.content, content_type='text/xml')  # Adjust content type if necessary
    else:
        # Handle the case where the request was not successful
        return HttpResponse('Error in WMS request', status=500)


def get_sites(request, x, y, d):
    """ Request all sites within a distance (d) of x;y. Use a distance of -9
        to request all sites.
    """
    from django.db import connection

    # Define SQL queries
    select_query = '''
        SELECT gid, ST_X(the_geom) as x, ST_Y(the_geom) as y, river_name, site_name, description, river_cat, date(time_stamp) AS time_stamp
        FROM sites
    '''

    order_query = ' ORDER BY river_name, site_name, time_stamp ASC'

    if d == '-9':
        where_query = ''
    else:
        query_envelope = str(float(x) - float(d)) + ',' + str(float(y) - float(d)) + ',' + str(float(x) + float(d)) + ',' + str(float(y) + float(d))
        where_query = '''
            WHERE ST_DWithin(ST_Transform(sites.the_geom, 3857), ST_MakeEnvelope(%s, 3857), %s)
        ''' % (query_envelope, d)

    # Construct the final SQL query
    sql_query = select_query + where_query + order_query

    with connection.cursor() as cursor:
        # Execute the raw SQL query
        cursor.execute(sql_query)

        # Fetch the results
        sites_returned = cursor.fetchall()

    # Return the results using the render function
    return render(request, 'monitor/sites.html', {'sites': sites_returned})


def get_closest_site(request, x, y, d):
    """ Requests the closest site within a distance (d) of x;y.
    """
    from django.db.models import Value
    from django.db.models.functions import Concat
    from django.db.models import Min

    xy_point = 'POINT(' + x + ' ' + y + ')'

    # Calculate the Euclidean distance between the site coordinates and the input point
    sites = Sites.objects.annotate(
        distance=SQRT(
            F('the_geom').transform(3857, output_field=Value('GEOMETRY')),
            F('the_geom').transform(3857, output_field=Value('GEOMETRY'))
        ).distance(xy_point)
    )

    # Find the closest site based on the distance
    closest_site = sites.filter(distance__lte=d).order_by('distance').first()

    return render(request, 'monitor/closest_site.html', {'site': closest_site})


def get_unique(request, field):
    """ Request all unique values for a specified field.
    """
    values_returned = Sites.objects.values(field).distinct()
    unique_values = [value[field] for value in values_returned]

    return render(request, 'monitor/unique_values.html', {'values': unique_values})


def get_schools(request):
    """ Request all schools with names starting with the letters in the search_str.
    """
    search_str = request.GET.get('query', '')  # Use get() method to provide a default value
    schools_returned = Schools.objects.filter(school__istartswith=search_str).order_by('school')

    return render(request, 'monitor/schools.html', {'schools': schools_returned})



def get_observations(request, site_id):
    """ Request all observations for the requested site ID.
    """
    observations = Observations.objects.filter(site_id=site_id).order_by('obs_date')

    return render(request, 'monitor/site_observations.html', {'observations': observations})



def download_observations(request, site_id):
    """ Download all observations for the requested site ID in csv format.
    """
    # Get the site's observations
    observations = Observations.objects.filter(site_id=site_id)

    # Get the site coordinates
    select_clause = 'SELECT gid, ST_X(the_geom) as x, ST_Y(the_geom) as y FROM sites WHERE gid = ' + str(site_id)
    site_coords = Sites.objects.raw(select_clause)

    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="observations.csv'
    writer = csv.writer(response)
    response.write(u'\ufeff'.encode('utf8'))  # BOM (optional...Excel needs it to open UTF-8 file properly)
    writer.writerow([
        smart_str("Obs ID"),
        smart_str("User name"),
        smart_str("Obs Date"),
        smart_str("Site name"),
        smart_str("River name"),
        smart_str("River category"),
        smart_str("Latitude"),
        smart_str("Longitude"),
        smart_str("Flatworms"),
        smart_str("Worms"),
        smart_str("Leeches"),
        smart_str("Crabs/shrimps"),
        smart_str("Stoneflies"),
        smart_str("Minnow mayflies"),
        smart_str("Other mayflies"),
        smart_str("Damselflies"),
        smart_str("Dragonflies"),
        smart_str("Bugs/beetles"),
        smart_str("Caddisflies"),
        smart_str("True flies"),
        smart_str("Snails"),
        smart_str("Score"),
        smart_str("Status"),
        smart_str("Water clarity"),
        smart_str("Water temp"),
        smart_str("pH"),
        smart_str("Diss oxygen"),
        smart_str("diss oxygen unit"),
        smart_str("Elec cond"),
        smart_str("Elec cond unit"),
        smart_str("Comment"),
    ])
    for obs in observations:
        if obs.flag == 'clean':
            flag = 'Verified'
        else:
            flag = 'Unverified'
        writer.writerow([
            smart_str(obs.pk),
            smart_str(obs.user.username),  # Use the username instead of the user object
            smart_str(obs.obs_date),
            smart_str(obs.site.site_name),  # Use the site's site_name instead of the site object
            smart_str(obs.site.river_name),
            smart_str(obs.site.river_cat),
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


def download_observations_filtered(request, filter_string):
    """ Download all observations for the requested filter string in csv format.
    """
    # Get the site's observations
    select_clause = 'SELECT * FROM minisass_observations WHERE ' + filter_string.replace("+", " ")
    with connection.cursor() as cursor:
        cursor.execute(select_clause)

        # Construct a dictionary of the observations
        fieldnames = [name[0] for name in cursor.description]
        observations = [dict(zip(fieldnames, row)) for row in cursor.fetchall()]

    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="observations.csv"'
    writer = csv.writer(response)
    response.write(u'\ufeff'.encode('utf8'))  # BOM (optional...Excel needs it to open UTF-8 file properly)
    writer.writerow([
        smart_str("Obs ID"),
        smart_str("User name"),
        smart_str("Obs Date"),
        smart_str("Site name"),
        smart_str("River name"),
        smart_str("River category"),
        smart_str("Latitude"),
        smart_str("Longitude"),
        smart_str("Flatworms"),
        smart_str("Worms"),
        smart_str("Leeches"),
        smart_str("Crabs/shrimps"),
        smart_str("Stoneflies"),
        smart_str("Minnow mayflies"),
        smart_str("Other mayflies"),
        smart_str("Damselflies"),
        smart_str("Dragonflies"),
        smart_str("Bugs/beetles"),
        smart_str("Caddisflies"),
        smart_str("True flies"),
        smart_str("Snails"),
        smart_str("Score"),
        smart_str("Status"),
        smart_str("Water clarity"),
        smart_str("Water temp"),
        smart_str("pH"),
        smart_str("Diss oxygen"),
        smart_str("diss oxygen unit"),
        smart_str("Elec cond"),
        smart_str("Elec cond unit"),
        smart_str("Comment"),
    ])
    for obs in observations:
        if obs['flag'] == 'clean':
            flag = 'Verified'
        else:
            flag = 'Unverified'
        writer.writerow([
            smart_str(obs['observations_gid']),
            smart_str(obs['username']),
            smart_str(obs['obs_date']),
            smart_str(obs['site_name']),
            smart_str(obs['river_name']),
            smart_str(obs['river_cat']),
            smart_str(obs['y']),
            smart_str(obs['x']),
            smart_str(obs['flatworms']),
            smart_str(obs['worms']),
            smart_str(obs['leeches']),
            smart_str(obs['crabs_shrimps']),
            smart_str(obs['stoneflies']),
            smart_str(obs['minnow_mayflies']),
            smart_str(obs['other_mayflies']),
            smart_str(obs['damselflies']),
            smart_str(obs['dragonflies']),
            smart_str(obs['bugs_beetles']),
            smart_str(obs['caddisflies']),
            smart_str(obs['true_flies']),
            smart_str(obs['snails']),
            smart_str(obs['score']),
            smart_str(flag),
            smart_str(obs['water_clarity']),
            smart_str(obs['water_temp']),
            smart_str(obs['ph']),
            smart_str(obs['diss_oxygen']),
            smart_str(obs['diss_oxygen_unit']),
            smart_str(obs['elec_cond']),
            smart_str(obs['elec_cond_unit']),
            smart_str(obs['comment']),
        ])
    return response



def zoom_observation(request, obs_id):
    try:
        observation = Observations.objects.get(pk=obs_id)
        site = Sites.objects.get(pk=observation.site_id)
    except (Observations.DoesNotExist, Sites.DoesNotExist):
        raise Http404("Observation does not exist")

    # Convert coordinates to Google projection
    x = site.the_geom.coords[0]
    y = site.the_geom.coords[1]

    site_form = SiteForm()
    observation_form = ObservationForm(initial={'site': '1', 'score': '0.0'})
    coords_form = CoordsForm()
    map_form = MapForm({
        'zoom_level': '15',
        'centre_X': x,
        'centre_Y': y,
        'edit_site': 'true',
        'error': 'false'
    })

    return render(request, 'monitor/index.html', {
        'site_form': site_form,
        'observation_form': observation_form,
        'coords_form': coords_form,
        'map_form': map_form
    })



