from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from minisass_authentication.models import Lookup, UserProfile, PasswordHistory


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


def correct_country(modeladmin, request, queryset):
    for user in queryset:
        if user.userprofile:
            if user.userprofile.country in ['ZA', 'SA', 'South Africa', '9']:
                user.userprofile.country = 'ZA'
                user.userprofile.save()
correct_country.short_description = "Correct Country"


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, )
    list_display = (
        "email", "first_name", "last_name", "is_staff"
    )
    list_filter = (
        'userprofile__expert_approval_status', 'userprofile__is_expert',
        'is_staff', 'is_superuser', 'is_active'
    )
    actions = [correct_country]
    exclude = ('username',)
    fieldsets = (
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'password')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    # Optionally customize the fields displayed in the user detail form (second step)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    # Make sure email is used instead of username
    def save_model(self, request, obj, form, change):
        if not change:
            obj.username = obj.email
        super().save_model(request, obj, form, change)


class PasswordHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'hashed_password', 'timestamp')


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(PasswordHistory, PasswordHistoryAdmin)
