import jwt
import logging
import requests
import secrets
import string
from constance import config
from django.conf import settings
from django.contrib.auth import get_user_model, login
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.urls import reverse
from django.http import JsonResponse
from jwt.exceptions import DecodeError, ExpiredSignatureError
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from minisass_authentication.models.yoma import YomaToken


User = get_user_model()

logger = logging.getLogger(__name__)


class YomaAuthCallbackView(APIView):
    """
    Handle YOMA OAuth2 callback and exchange authorization code for access token.

    This endpoint receives the authorization code from YOMA after user authentication
    and exchanges it for an access token that can be used for subsequent API calls.
    """

    def get(self, request):
        """
        Handle GET request from YOMA callback with authorization code.

        Expected URL: /auth/yoma/callback?code=abc123&session_state=xyz456
        """
        # Extract authorization code and session state from query parameters
        auth_code = request.GET.get('code')
        session_state = request.GET.get('session_state')
        error = request.GET.get('error')
        error_description = request.GET.get('error_description')

        # Handle OAuth errors
        if error:
            logger.error(f"YOMA OAuth error: {error} - {error_description}")
            return Response({
                'error': error,
                'error_description': error_description or 'Authentication failed'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate required parameters
        if not auth_code:
            logger.error("Missing authorization code in YOMA callback")
            return Response({
                'error': 'missing_code',
                'error_description': 'Authorization code is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            token_response = self._exchange_code_for_token(auth_code)

            if token_response.get('error'):
                return Response(token_response, status=status.HTTP_400_BAD_REQUEST)

            # Decode the ID token to get user information
            try:
                # Note: In production, you should verify the JWT signature
                # For now, we'll decode without verification (not recommended for production)
                id_token = token_response.get('id_token')
                if not id_token:
                    return Response(
                        {'error': 'missing_id_token', 'error_description': 'ID token not found in response'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Decode JWT without verification (add verification in production)
                decoded_token = jwt.decode(id_token, options={"verify_signature": False})

                # Extract user information from the token
                email = decoded_token.get('email')
                username = decoded_token.get('preferred_username') or decoded_token.get('sub')
                first_name = decoded_token.get('given_name', '')
                last_name = decoded_token.get('family_name', '')

                if not email or not username:
                    return Response(
                        {'error': 'invalid_token', 'error_description': 'Required user information not found in token'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Generate a complex random password
                def generate_complex_password(length=16):
                    """Generate a complex random password with uppercase, lowercase, digits, and special characters."""
                    # Ensure at least one character from each category
                    uppercase = secrets.choice(string.ascii_uppercase)
                    lowercase = secrets.choice(string.ascii_lowercase)
                    digit = secrets.choice(string.digits)
                    special = secrets.choice('!@#$%^&*()_+-=[]{}|;:,.<>?')

                    # Fill the rest with random characters from all categories
                    all_chars = string.ascii_letters + string.digits + '!@#$%^&*()_+-=[]{}|;:,.<>?'
                    remaining = ''.join(secrets.choice(all_chars) for _ in range(length - 4))

                    # Combine and shuffle
                    password_chars = list(uppercase + lowercase + digit + special + remaining)
                    secrets.SystemRandom().shuffle(password_chars)

                    return ''.join(password_chars)

                # Get or create user
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': username,
                        'first_name': first_name,
                        'last_name': last_name,
                        'password': make_password(generate_complex_password()),
                        'is_active': True,
                    }
                )

                # If user already exists but username is different, update it
                if not created and user.username != username:
                    user.username = username
                    user.first_name = first_name
                    user.last_name = last_name
                    user.save()

                # Authenticate and login the user
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            except (DecodeError, ExpiredSignatureError, KeyError) as e:
                return Response(
                    {'error': 'token_decode_error', 'error_description': f'Failed to decode ID token: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Store token in database using the model's class method
            YomaToken.create_or_update_token(
                user=user,  # Use the authenticated user
                token_data=token_response,
                session_state=session_state
            )

            # Log successful token exchange (without sensitive data)
            logger.info(f"Successfully stored YOMA token for user {request.user.username}. Session: {session_state}")

            # Return success response with token info
            # return Response({
            #     'success': True,
            #     'message': 'YOMA authentication successful and token stored',
            #     'token_info': {
            #         'expires_at': yoma_token.expires_at.isoformat(),
            #         'refresh_expires_at': yoma_token.refresh_expires_at.isoformat() if yoma_token.refresh_expires_at else None,
            #         'scope': yoma_token.scope,
            #         'token_type': yoma_token.token_type,
            #         'is_valid': yoma_token.is_valid,
            #         'created_at': yoma_token.created_at.isoformat(),
            #         'updated_at': yoma_token.updated_at.isoformat()
            #     }
            # }, status=status.HTTP_200_OK)
            return redirect(reverse('home'))  # Replace 'home' with your actual URL name

        except Exception as e:
            logger.error(f"Error during YOMA token exchange: {str(e)}")
            return Response({
                'error': 'token_exchange_failed',
                'error_description': 'Failed to exchange authorization code for token'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _exchange_code_for_token(self, auth_code):
        """
        Exchange authorization code for access token with YOMA.

        Args:
            auth_code (str): Authorization code received from YOMA

        Returns:
            dict: Token response from YOMA or error details
        """
        # YOMA token endpoint
        token_url = f"{config.YOMA_BASE_URI}/auth/realms/yoma/protocol/openid-connect/token"

        # Get configuration from Django settings
        client_id = config.YOMA_CLIENT_ID
        client_secret = config.YOMA_CLIENT_SECRET
        redirect_uri = config.YOMA_REDIRECT_URI

        if not client_id or not client_secret:
            logger.error("YOMA client credentials not configured")
            return {
                'error': 'configuration_error',
                'error_description': 'YOMA client credentials not configured'
            }

        # Prepare token exchange request data
        token_data = {
            'grant_type': 'authorization_code',
            'code': auth_code,
            'redirect_uri': redirect_uri,
            'client_id': client_id,
            'client_secret': client_secret
        }

        # Set request headers (exactly like your curl command)
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }

        try:
            # Make token exchange request (exactly like your curl command)
            response = requests.post(
                token_url,
                headers=headers,
                data=token_data,
                timeout=30
            )

            # Parse response
            response_data = response.json()

            if response.status_code == 200:
                logger.info("Successfully exchanged authorization code for YOMA token")
                return response_data
            else:
                logger.error(f"YOMA token exchange failed: {response.status_code} - {response_data}")
                return {
                    'error': response_data.get('error', 'token_exchange_failed'),
                    'error_description': response_data.get('error_description', 'Failed to exchange code for token')
                }

        except requests.exceptions.RequestException as e:
            logger.error(f"Network error during YOMA token exchange: {str(e)}")
            return {
                'error': 'network_error',
                'error_description': 'Failed to connect to YOMA token endpoint'
            }
        except ValueError as e:
            logger.error(f"Invalid JSON response from YOMA: {str(e)}")
            return {
                'error': 'invalid_response',
                'error_description': 'Invalid response from YOMA token endpoint'
            }


class YomaAuthInitiateView(APIView):
    """
    Provide YOMA authentication URL for initiating OAuth2 flow.

    This endpoint returns the YOMA authentication URL that clients should redirect to
    for user authentication.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """
        Return YOMA authentication URL with proper parameters.
        """
        try:
            # Get configuration from Django settings
            client_id = config.YOMA_CLIENT_ID
            redirect_uri = config.YOMA_REDIRECT_URI

            if not client_id:
                return Response({
                    'error': 'configuration_error',
                    'error_description': 'YOMA client ID not configured'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Build YOMA authentication URL
            auth_url = (
                f"{config.YOMA_BASE_URI}/auth/realms/yoma/protocol/openid-connect/auth"
                f"?client_id={client_id}"
                f"&redirect_uri={redirect_uri}"
                "&response_type=code"
                "&scope=openid+email+profile+yoma-api+phone"
            )

            return Response({
                'auth_url': auth_url,
                'client_id': client_id,
                'redirect_uri': redirect_uri,
                'scope': 'openid+email+profile+yoma-api+phone'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error generating YOMA auth URL: {str(e)}")
            return Response({
                'error': 'url_generation_failed',
                'error_description': 'Failed to generate YOMA authentication URL'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class YomaTokenStatusView(APIView):
    """
    Check the status of the user's YOMA token.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return the current YOMA token status for the authenticated user.
        """
        try:
            yoma_token = YomaToken.objects.get(user=request.user)

            return Response({
                'has_token': True,
                'is_valid': yoma_token.is_valid,
                'is_access_token_expired': yoma_token.is_access_token_expired,
                'is_refresh_token_expired': yoma_token.is_refresh_token_expired,
                'expires_at': yoma_token.expires_at.isoformat(),
                'refresh_expires_at': yoma_token.refresh_expires_at.isoformat() if yoma_token.refresh_expires_at else None,
                'scope': yoma_token.scope,
                'token_type': yoma_token.token_type,
                'created_at': yoma_token.created_at.isoformat(),
                'updated_at': yoma_token.updated_at.isoformat()
            }, status=status.HTTP_200_OK)

        except YomaToken.DoesNotExist:
            return Response({
                'has_token': False,
                'message': 'No YOMA token found for this user'
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f"Error checking YOMA token status: {str(e)}")
            return Response({
                'error': 'status_check_failed',
                'error_description': 'Failed to check YOMA token status'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
