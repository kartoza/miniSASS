from django.urls import path

# from minisass_authentication.views import school_names
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # for obtaining the access token
    TokenRefreshView,     # for refreshing the access token
)
from minisass_authentication.views import user_login, register

urlpatterns = [
    # path('school_names/', school_names, name='school_names'),

    path('api/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', user_login, name='user_login'),
    path('api/register/', register, name='register'),
]
