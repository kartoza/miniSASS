from django.conf.urls import *
from django.conf import settings

# urlconfs for views on the miniSASS app will be added here
urlpatterns = patterns('monitor.views',

    # Monitor app
    url(r'^$', 'index', {}, name='monitor_index'),
    url(r'^wms/~(?P<wms_url>[^~]+)~(?P<wms_params>[^~]+)', 'wms_get_feature_info'),
    url(r'^sites/(?P<x>[^/]+)/(?P<y>[^/]+)/(?P<d>[^/]+)/','get_sites'),
    url(r'^closest_site/(?P<x>[^/]+)/(?P<y>[^/]+)/(?P<d>[^/]+)/','get_closest_site'),
    url(r'^unique/(?P<field>[^/]+)/','get_unique'),
    url(r'^observation/(?P<obs_id>\d+)/$','zoom_observation'),
    url(r'^observations/(?P<site_id>\d+)/$','get_observations'),
    url(r'^observations/download/(?P<site_id>\d+)/$','download_observations'),
    url(r'^observations/download/filtered/~(?P<filter_string>[^~]+)','download_observations_filtered'),
    url(r'^schools/','get_schools'),
    url(r'^(?P<monitor_id>\d+)/$', 'detail', {}, name='monitor_detail'),
        )
