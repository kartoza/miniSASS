from django.conf.urls import *
from django.conf import settings

# urlconfs for views on the miniSASS app will be added here
urlpatterns = patterns('monitor.views',

    # Monitor app
    url(r'^$', 'index', {}, name='monitor_index'),
    url(r'wms/~(?P<wms_url>[^~]+)~(?P<wms_params>[^~]+)', 'wms_get_feature_info'),
    url(r'^(?P<monitor_id>\d+)/$', 'detail', {}, name='monitor_detail'),
        )
