from django.urls import path
from monitor.observation_views import (
    ObservationListCreateView, 
    ObservationRetrieveUpdateDeleteView,
    ObservationRetrieveView,
    RecentObservationListView,
    create_observations
)
from monitor.site_views import (
    SitesListCreateView, 
    SiteRetrieveUpdateDestroyView
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
    DownloadObservations,
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
    path('legacy/observation/<int:obs_id>/', zoom_observation),
    path('legacy/observations/<int:site_id>/', get_observations),
    path('observations/download/<int:site_id>/', download_observations),
    path(
        'observations/download-v2/<int:site_id>/',
        DownloadObservations.as_view(),
        name='download-observations'
    ),
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
        'sites/', 
        SitesListCreateView.as_view(), 
        name='sites-list-create'
    ),
    path(
        'sites/<int:pk>/', 
        SiteRetrieveUpdateDestroyView.as_view(), 
        name='site-retrieve-update-destroy'
    ),
    path(
        'observations-create/', 
        create_observations, 
        name='create_observations'
    ),

    path(
        'observations/recent-observations/', 
        RecentObservationListView.as_view(), 
        name='recent-observation-list'
    ),
    
    path(
        'observations/observation-details/<int:pk>/', 
        ObservationRetrieveView.as_view(),
        name='observation-details'
    ),

]
