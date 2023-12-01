from django.urls import path

from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from minisass_authentication.views import (
    activate_account,
    check_authentication_status,
    user_login, 
    register,
    request_password_reset,
    user_logout,
    verify_reset_token,
    reset_password,
    contact_us
)


urlpatterns = [
    path('api/request-reset/', request_password_reset, name='request_password_reset'),
    path('api/reset/<str:uidb64>/<str:token>/', verify_reset_token, name='verify_reset_token'),
    path('api/reset/<str:uidb64>/<str:token>/confirm/', reset_password, name='reset_password'),
    path('api/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', user_login, name='user_login'),
    path('api/register/', register, name='register'),
    path('api/logout/', user_logout, name='user-logout'),
    path('api/check-auth-status/', check_authentication_status, name='check-auth-status'),
    path('api/contact-us', contact_us, name='contact_us'),
    path('api/activate/<str:uidb64>/<str:token>/', activate_account, name='activate-account')
]
