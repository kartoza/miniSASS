from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class YomaToken(models.Model):
    """
    Store YOMA OAuth2 token data for authenticated users.

    This model stores the access token, refresh token, and related metadata
    received from YOMA's OAuth2 token endpoint.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='yoma_token',
        help_text="User associated with this YOMA token"
    )

    access_token = models.TextField(
        help_text="YOMA access token for API requests"
    )

    refresh_token = models.TextField(
        blank=True,
        null=True,
        help_text="YOMA refresh token for obtaining new access tokens"
    )

    id_token = models.TextField(
        blank=True,
        null=True,
        help_text="YOMA ID token containing user identity information"
    )

    token_type = models.CharField(
        max_length=50,
        default='Bearer',
        help_text="Type of the access token (usually 'Bearer')"
    )

    expires_at = models.DateTimeField(
        help_text="When the access token expires"
    )

    refresh_expires_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="When the refresh token expires"
    )

    scope = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="OAuth2 scopes granted for this token"
    )

    session_state = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="YOMA session state identifier"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this token record was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When this token record was last updated"
    )

    class Meta:
        db_table = 'yoma_tokens'
        verbose_name = 'YOMA Token'
        verbose_name_plural = 'YOMA Tokens'
        ordering = ['-created_at']

    def __str__(self):
        return f"YOMA Token for {self.user.username}"

    @property
    def is_access_token_expired(self):
        """Check if the access token has expired."""
        return timezone.now() >= self.expires_at

    @property
    def is_refresh_token_expired(self):
        """Check if the refresh token has expired."""
        if not self.refresh_expires_at:
            return True
        return timezone.now() >= self.refresh_expires_at

    @property
    def is_valid(self):
        """Check if the token is still valid (not expired)."""
        return not self.is_access_token_expired

    def save(self, *args, **kwargs):
        """Override save to ensure proper datetime handling."""
        super().save(*args, **kwargs)

    @classmethod
    def create_or_update_token(cls, user, token_data, session_state=None):
        """
        Create or update YOMA token for a user.

        Args:
            user: User instance
            token_data: Dictionary containing token response from YOMA
            session_state: Optional session state from OAuth callback

        Returns:
            YomaToken instance
        """
        # Calculate expiry times
        expires_in = token_data.get('expires_in', 0)
        refresh_expires_in = token_data.get('refresh_expires_in', 0)

        expires_at = timezone.now() + timedelta(seconds=expires_in)
        refresh_expires_at = None
        if refresh_expires_in:
            refresh_expires_at = timezone.now() + timedelta(seconds=refresh_expires_in)

        # Create or update token
        token, created = cls.objects.update_or_create(
            user=user,
            defaults={
                'access_token': token_data.get('access_token', ''),
                'refresh_token': token_data.get('refresh_token', ''),
                'id_token': token_data.get('id_token', ''),
                'token_type': token_data.get('token_type', 'Bearer'),
                'expires_at': expires_at,
                'refresh_expires_at': refresh_expires_at,
                'scope': token_data.get('scope', ''),
                'session_state': session_state,
            }
        )

        return token
