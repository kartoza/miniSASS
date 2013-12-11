from django.contrib import admin

from minisass_registration.models import Lookup, UserProfile


class LookupAdmin(admin.ModelAdmin):
    list_display = ('container', 'description', 'active',)
    list_display_links = ('description',)
    ordering = ('container', 'description',)
    search_fields = ('description',)
    list_editable = ('active',)
    list_filter = ('active', 'container', )

admin.site.register(Lookup, LookupAdmin)


class UserProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('user',)
    list_display = (
            'user', 'organisation_type', 'organisation_name', 'country',)
    search_fields = ('user__username', 'user__first_name', 'user__last_name',)
    list_filter = ('organisation_type', 'country',)

admin.site.register(UserProfile, UserProfileAdmin)

