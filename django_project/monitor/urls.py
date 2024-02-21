from django.urls import path, include
from rest_framework.routers import DefaultRouter

from monitor.observation_views import (
    ObservationListCreateView,
    ObservationRetrieveUpdateDeleteView,
    ObservationRetrieveView,
    RecentObservationListView,
    ObservationListView,
    create_observations,
    ObservationImageViewSet,
    get_observations_by_site,
    upload_pest_image,
    delete_pest_image
)
from monitor.site_views import (
    AssessmentListCreateView,
    AssessmentRetrieveUpdateDestroyView,
    SitesListCreateView,
    SiteRetrieveUpdateDestroyView,
    SiteObservationsByLocation,
    SaveSiteImagesView,
    SaveObservationImagesView
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
    detail,
    CheckSiteIsLand
)

router = DefaultRouter()
router.register(
    r'image',
    ObservationImageViewSet, basename='observation-image-view'
)

# URL patterns for the miniSASS app
urlpatterns = [
    path('', index, name='monitor_index'),
    path('wms/~<str:wms_url>~<str:wms_params>', wms_get_feature_info),
    path(
        'sites/is-land/<str:lat>/<str:long>/',
        CheckSiteIsLand.as_view(),
        name='check-coordinate-is-land'
    ),
    path('sites/<str:x>/<str:y>/<str:d>/', get_sites),
    path('closest_site/<str:x>/<str:y>/<str:d>/', get_closest_site),
    path('unique/<str:field>/', get_unique),
    path('legacy/observation/<int:obs_id>/', zoom_observation),
    path('legacy/observations/<int:site_id>/', get_observations),
    path('observations/download/<int:site_id>/', download_observations),
    path('observations/download/filtered/~<str:filter_string>',
         download_observations_filtered),
    path(
        'observations/download-v2/<int:site_id>/',
        DownloadObservations.as_view(),
        name='download-observations'
    ),
    path(
        'observations/download/filtered/~<str:filter_string>',
        download_observations_filtered
    ),
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
        'upload-pest-images/', 
        upload_pest_image,
        name='upload-pest-images'
    ),
    path(
        'observation-images/<int:observation_pk>/delete/<int:pk>/',
        delete_pest_image,
        name='remove-pest-image'
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

        path(
        'site-observations/<latitude>/<longitude>/', 
        SiteObservationsByLocation.as_view(), 
        name='site-observations'
    ),

    path(
        'observations/observation-details/<int:observation_pk>/',
        include(router.urls)
    ),

    path(
        'observations-list/', 
        ObservationListView.as_view(), 
        name='observation-list'
    ),

    path(
        'site-assessments/', 
        AssessmentListCreateView.as_view(), 
        name='assessment-list-create'
    ),
    path(
        'site-assessments/<int:pk>/', 
        AssessmentRetrieveUpdateDestroyView.as_view(), 
        name='assessment-retrieve-update-destroy'
    ),
    path(
        'observations/by-site/<int:site_id>/', 
        get_observations_by_site,
        name='observations-by-site'
    ),
    path(
        'sites/<int:site_id>/save-images/', 
        SaveSiteImagesView.as_view(), 
        name='save_site_images'
    ),
    path(
        'observations/<int:observationId>/save-images/', 
        SaveObservationImagesView.as_view(), 
        name='save_observation_images'
    ),
]
