from django.contrib import admin
from minisass_authentication.models import Lookup, UserProfile

@admin.register(Lookup)
class LookupAdmin(admin.ModelAdmin):
    list_display = ('container', 'description', 'active')
    list_display_links = ('description',)
    ordering = ('container', 'description',)
    search_fields = ('description',)
    list_editable = ('active',)
    list_filter = ('active', 'container', )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('user',)
    list_display = ('user', 'organisation_type', 'organisation_name', 'country')
    search_fields = ('user__username', 'user__first_name', 'user__last_name',)
    list_filter = ('organisation_type', 'country',)
