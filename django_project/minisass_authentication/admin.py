from django.contrib import admin
from minisass_authentication.models import Lookup, UserProfile, PasswordHistory
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
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
    list_display = ('user', 'organisation_name', 'organisation_type', 'is_expert', 'country',)
    search_fields = ('user__username', 'user__first_name', 'user__last_name',)
    list_filter = ('organisation_type', 'country', 'is_expert',)

    def get_readonly_fields(self, request, obj=None):
        # Make 'is_expert' field read-only for non-admin users
        if not request.user.is_superuser:
            return self.readonly_fields + ('is_expert',)
        return self.readonly_fields


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'UserProfile'


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, )
    list_filter = (
        'userprofile__expert_approval_status', 'userprofile__is_expert',
        'is_staff', 'is_superuser', 'is_active'
    )


class PasswordHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'hashed_password', 'timestamp')


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(PasswordHistory, PasswordHistoryAdmin)
