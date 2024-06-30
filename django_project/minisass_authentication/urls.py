from django.urls import path

from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from minisass_authentication.views import (
    activate_account,
    check_authentication_status,
    check_registration_status,
    user_login, 
    register,
    request_password_reset,
    verify_password_reset,
    update_password,
    user_logout,
    contact_us,
    UpdateUser,
    UploadCertificate,
    UpdatePassword,
    check_is_expert,
    retrieve_email_by_username,
    generate_special_token
)


urlpatterns = [
    path('api/generate-special-token/<str:username>', generate_special_token, name='generate_special_token'),
    path('api/request-reset/', request_password_reset, name='request_password_reset'),
    path('api/verify-password-reset/<uidb64>/<token>/', verify_password_reset, name='verify_password_reset'),
    path('api/update-password-reset/<uid>/<token>/', update_password, name='update_password_reset'),
    
    path('api/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', user_login, name='user_login'),
    path('api/register/', register, name='register'),
    path('api/logout/', user_logout, name='user-logout'),
    path('api/user/update/', UpdateUser.as_view(), name='profile-update'),
    path('api/user/password/update/', UpdatePassword.as_view(), name='password-update'),
    path('api/user/certificate/upload/', UploadCertificate.as_view(), name='certificate-upload'),
    path('api/check-auth-status/', check_authentication_status, name='check-auth-status'),
    path('api/check-registration-status/<str:email>/', check_registration_status, name='check_registration_status'),
    path('api/contact-us', contact_us, name='contact_us'),
    path('api/activate/<str:uidb64>/<str:token>/', activate_account, name='activate-account'),
    path('api/user-profile/is-expert/<str:email>/', check_is_expert, name='user-profile-is-expert'),
    path('api/retrieve-email-by-username/<str:username>/', retrieve_email_by_username, name='retrieve-email-by-username'),
]
