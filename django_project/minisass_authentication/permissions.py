from rest_framework.permissions import IsAuthenticated
from django.conf import settings


def get_client_ip(request):
    """Best-effort real client IP.

    REMOTE_ADDR alone is not usable in this deployment. nginx and Django run in the
    same ECS task behind an Application Load Balancer, so REMOTE_ADDR is the ALB's
    private address and can never match a public IP in the whitelist. That silently
    made IP whitelisting a no-op in production.

    X-Forwarded-For is a client-controlled header that trusted proxies append to,
    so only the entries added by our own proxies can be believed. We therefore
    count settings.TRUSTED_PROXY_DEPTH positions in from the right rather than
    taking the leftmost value, which a caller could spoof freely.
    """
    depth = getattr(settings, 'TRUSTED_PROXY_DEPTH', 0)
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')

    if depth and forwarded:
        parts = [part.strip() for part in forwarded.split(',') if part.strip()]
        if parts:
            index = len(parts) - depth
            # Clamp: a shorter chain than expected means we take the leftmost entry
            # rather than reading past the start of the list.
            return parts[max(index, 0)]

    return request.META.get('REMOTE_ADDR')


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
        if not whitelisted_ips:
            return False

        return get_client_ip(request) in whitelisted_ips
