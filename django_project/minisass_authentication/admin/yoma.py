from django.contrib import admin
from minisass_authentication.models.yoma import YomaToken


@admin.register(YomaToken)
class YomaTokenAdmin(admin.ModelAdmin):
    """
    Admin interface for YOMA tokens.
    """
    list_display = [
        'user',
        'token_type',
        'expires_at',
        'is_valid',
        'scope',
        'created_at',
        'updated_at'
    ]

    list_filter = [
        'token_type',
        'created_at',
        'expires_at',
        'updated_at'
    ]

    search_fields = [
        'user__username',
        'user__email',
        'scope',
        'session_state'
    ]

    readonly_fields = [
        'access_token',
        'refresh_token',
        'id_token',
        'created_at',
        'updated_at',
        'is_valid',
        'is_access_token_expired',
        'is_refresh_token_expired'
    ]

    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Token Information', {
            'fields': (
                'access_token',
                'refresh_token',
                'id_token',
                'token_type',
                'scope'
            )
        }),
        ('Expiry Information', {
            'fields': (
                'expires_at',
                'refresh_expires_at',
                'is_valid',
                'is_access_token_expired',
                'is_refresh_token_expired'
            )
        }),
        ('Session Information', {
            'fields': ('session_state',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        })
    )

    def is_valid(self, obj):
        """Display token validity status."""
        return obj.is_valid

    is_valid.boolean = True
    is_valid.short_description = 'Is Valid'

    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        return super().get_queryset(request).select_related('user')
