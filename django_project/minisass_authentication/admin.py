from django.contrib import admin
from minisass_authentication.models import Lookup, UserProfile
from django import forms
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

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
    list_display = ('user', 'organisation_name', 'organisation_type', 'is_expert','country',)
    search_fields = ('user__username', 'user__first_name', 'user__last_name',)
    list_filter = ('organisation_type', 'country','is_expert',)

    def get_readonly_fields(self, request, obj=None):
        # Make 'is_expert' field read-only for non-admin users
        if not request.user.is_superuser:
            return self.readonly_fields + ('is_expert',)
        return self.readonly_fields
