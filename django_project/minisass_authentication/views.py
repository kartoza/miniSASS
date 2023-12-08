from minisass_authentication.serializers import UserSerializer, UserUpdateSerializer
from django.conf import settings
from django.contrib.auth import (
    authenticate,
    login,
    get_user_model,
    logout
)
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.models import Site
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.http import HttpResponseRedirect, HttpResponseBadRequest
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from minisass_authentication.models import UserProfile, Lookup
from minisass_authentication.serializers import UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_authentication_status(request):
    user_data = {
        'is_authenticated': request.user.is_authenticated,
        'username': request.user.username if request.user.is_authenticated else None,
        'email': request.user.email if request.user.is_authenticated else None,
        'is_admin': request.user.is_staff if request.user.is_authenticated else None
    }
    return JsonResponse(user_data, status=200)


@api_view(['POST'])
def contact_us(request):
    email = request.data.get('email')
    name = request.data.get('name')
    phone = request.data.get('phone')
    message = request.data.get('message')

    domain = Site.objects.get_current().domain

    mail_subject = 'Contact Us'
    message = render_to_string('contact_us.html', {
        'from': email,
        'name': name,
        'contact': phone,
        'message': message,
        'domain': domain
    })
    send_mail(
        mail_subject,
        None,
        email,
        [settings.CONTACT_US_RECEPIENT_EMAIL],
        html_message=message
    )
    
    return Response({'message': 'Email sent'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Create a unique token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Get the current site's domain
    domain = Site.objects.get_current().domain
    reset_link = request.build_absolute_uri(
        reverse('verify_password_reset', kwargs={
        'uid': uid, 'token': token
        })
    )

    # Send a password reset email to the user
    mail_subject = 'Password Reset Request'
    message = render_to_string('password_reset_email.html', {
        'user': user,
        'domain': domain,
        'reset_link': reset_link,
    })
    send_mail(
        mail_subject,
        None,
        settings.CONTACT_US_RECEPIENT_EMAIL,
        [email],
        html_message=message
    )
    
    return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def verify_password_reset(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        # Token and user are valid, redirect to 'home' with uid and token parameters
        redirect_url = reverse('home') + f'?uid={uidb64}&token={token}'
        return HttpResponseRedirect(redirect_url)
    
    return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def update_password(request, uid, token):
    newPassword = request.data.get('newPassword')

    try:
        uid = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        # Set the new password for the user
        user.set_password(newPassword)
        user.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

    return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET'])
def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        redirect_url = reverse('home') + '?activation_complete=true'
        return HttpResponseRedirect(redirect_url)
    else:
        user.delete()
        return HttpResponseBadRequest('Invalid token or expired')


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.first_name = request.data.get('name')
            user.last_name = request.data.get('surname')
            user_email = request.data.get('email')
            username = request.data.get('username')
            
            # Create a User Profile
            org_name = request.data.get('organizationName')
            user_country = request.data.get('country')
            organisation_type_description = request.data.get('organizationType')
            
            if org_name and user_country and organisation_type_description:
                # Retrieve the Lookup object based on the description.
                # This assumes that the 'description' field in the Lookup model is unique.
                try:
                    organisation_type = Lookup.objects.get(description__iexact=organisation_type_description)
                except Lookup.DoesNotExist:
                    # If no match is found, use the default description "Organisation Type".
                    organisation_type = Lookup.objects.get(description__iexact="Organisation Type")
                
                user_profile = UserProfile.objects.create(
                    user=user,
                    organisation_type=organisation_type,
                    organisation_name=request.data.get('organizationName', ''),
                    country=request.data.get('country', None)
                )
                user_profile.save()
                user.is_active = False
                user.save()

                # Get the current site's domain
                domain = Site.objects.get_current().domain

                # Generate token
                token = default_token_generator.make_token(user) 

                # Encode user ID for URL use
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Compose the reset link URL
                activation_link = request.build_absolute_uri(
                    reverse('activate-account', kwargs={
                            'uidb64': uidb64, 'token': token})
                )

                mail_subject = 'Activate account on miniSASS'
                message = render_to_string('activate_account.html', {
                    'domain': domain,
                    'activation_link': activation_link,
                    'name': username
                })
                send_mail(
                    mail_subject,
                    None,
                    settings.CONTACT_US_RECEPIENT_EMAIL,
                    [user_email],
                    html_message=message
                )

            else:
                return Response({'error': 'Missing required fields for User Profile creation. country ,organisation name, organisation type'}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UpdateUser(APIView):
    """
    Endpoint to update user profile and password
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserUpdateSerializer(request.user).data)


@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':

        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            
            access_token = RefreshToken.for_user(user).access_token

            user_data = {
                'username': user.username,
                'email': user.email,
                'access_token': str(access_token),
                'refresh_token': str(RefreshToken.for_user(user)),
                'is_authenticated': True,
                'is_admin': request.user.is_staff if request.user.is_authenticated else None
            }

            return Response(user_data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
