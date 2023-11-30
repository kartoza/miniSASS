import json
from minisass_authentication.serializers import UserSerializer
from minisass_authentication.models import UserProfile, Lookup
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import (
    api_view,
    permission_classes
)
from django.contrib.auth import (
    authenticate,
    login,
    get_user_model, 
    logout
)
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from django.http import JsonResponse



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
    }
    return JsonResponse(user_data, status=200)


@api_view(['POST'])
def contact_us(request):
    email = request.data.get('email')
    name = request.data.get('name')
    phone = request.data.get('phone')
    message = request.data.get('message')

    mail_subject = 'Contact Us'
    message = render_to_string('contact_us.html', {
        'from': email,
        'name': name,
        'contact': phone,
        'message': message,
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
    User = get_user_model()

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Create a unique token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Create a reset link to use this to route to a password reset page

    # Get the current site's domain
    current_site = get_current_site(request)
    domain = current_site.domain
    reset_link = f'https://{domain}/authentication/api/reset-password/{uid}/{token}/'

    # Send a password reset email to the user
    current_site = get_current_site(request)
    mail_subject = 'Password Reset'
    message = render_to_string('password_reset_email.html', {
        'user': user,
        'domain': current_site.domain,
        'reset_link': reset_link,
    })
    email = EmailMessage(mail_subject, message, to=[user.email])
    email.send()
    
    return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def verify_reset_token(request, uidb64, token):
    try:
        uid = str(urlsafe_base64_decode(uidb64), 'utf-8')
        user = get_user_model().objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        # Token is valid
        return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Token is invalid'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def reset_password(request, uidb64, token):
    try:
        uid = str(urlsafe_base64_decode(uidb64), 'utf-8')
        user = get_user_model().objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        new_password = request.data.get('new_password')
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Token is invalid'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.first_name = request.data.get('first_name')
            user.last_name = request.data.get('last_name')
            
            
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
                user.save()
            else:
                return Response({'error': 'Missing required fields for User Profile creation. country ,organisation name, organisation type'}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
                'is_authenticated': True
            }

            return Response(user_data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
