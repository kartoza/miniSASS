from django.conf.urls import *
from django.conf import settings

# urlconfs for views on the miniSASS app will be added here
urlpatterns = patterns('monitor.views',

    # Monitor app
    #url(r'^monitor/data_input/$', 'data_input'),
    url(r'^$', 'index', {}, name='monitor_index'),
    url(r'^data_input/$', 'data_input', {}, name='monitor_data_input'),
    url(r'^(?P<monitor_id>\d+)/$', 'detail', {}, name='monitor_detail'),
        )
