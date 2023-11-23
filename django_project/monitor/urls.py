from django.urls import path
from monitor.observation_views import (
    ObservationListCreateView, 
    ObservationRetrieveUpdateDeleteView
)
from monitor.views import (
    index, 
    wms_get_feature_info, 
    get_sites, 
    get_closest_site, 
    get_unique, 
    zoom_observation, 
    get_observations, 
    download_observations, 
    download_observations_filtered, 
    get_schools, 
    detail
)

# URL patterns for the miniSASS app
urlpatterns = [
    path('', index, name='monitor_index'),
    path('wms/~<str:wms_url>~<str:wms_params>', wms_get_feature_info),
    path('sites/<str:x>/<str:y>/<str:d>/', get_sites),
    path('closest_site/<str:x>/<str:y>/<str:d>/', get_closest_site),
    path('unique/<str:field>/', get_unique),
    path('observation/<int:obs_id>/', zoom_observation),
    path('observations-old/<int:site_id>/', get_observations),
    path('observations/download/<int:site_id>/', download_observations),
    path('observations/download/filtered/~<str:filter_string>', download_observations_filtered),
    path('schools/', get_schools),
    path('<int:monitor_id>/', detail, name='monitor_detail'),

    path(
        'observations/',
        ObservationListCreateView.as_view(),
        name='observation-list-create'
    ),
    path(
        'observations/<int:pk>/',
        ObservationRetrieveUpdateDeleteView.as_view(),
        name='observation-retrieve-update-delete'
    ),
    path(
        'observations/site/<int:site_id>/',
        ObservationListCreateView.as_view(),
        name='observation-list-by-site'
    ),
]
