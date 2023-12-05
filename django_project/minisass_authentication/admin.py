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
    raw_id_fields = ('user',)
    list_display = ('user', 'organisation_type', 'organisation_name', 'country')
    search_fields = ('user__username', 'user__first_name', 'user__last_name',)
    list_filter = ('organisation_type', 'country','is_expert'),

class UserProfileAdminForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = '__all__'

    def clean_is_expert(self):
        # Ensure is_expert can only be changed by admin
        if self.cleaned_data['is_expert'] != self.instance.is_expert and not self.instance.user.is_staff:
            raise forms.ValidationError('is_expert can only be changed by an admin.')
        return self.cleaned_data['is_expert']

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)

    # Use the custom form for UserProfile
    form = UserProfileAdminForm

# Unregister the default UserAdmin
admin.site.unregister(User)

# Register UserAdmin with the custom form
admin.site.register(User, CustomUserAdmin)
