from rest_framework.permissions import IsAuthenticated
from django.conf import settings

class IsAuthenticatedOrWhitelisted(IsAuthenticated):
    """
    Allow access to authenticated users or whitelisted IP addresses.
    """

    def has_permission(self, request, view):
        # Check if the request is authenticated
        if super().has_permission(request, view):
            return True
        
        # Check if the IP address is whitelisted
        whitelisted_ips = getattr(settings, 'WHITELISTED_IP_ADDRESSES', [])
        client_ip = request.META.get('REMOTE_ADDR')
        if client_ip in whitelisted_ips:
            return True
        
        return False
