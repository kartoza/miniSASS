from django.contrib import admin

from monitor.models import Sites
from monitor.models import Observations


def make_verified(modeladmin, request, queryset):
    queryset.update(flag='clean')
make_verified.short_description = (
    "Mark selected observations as verified (clean)")


def make_unverified(modeladmin, request, queryset):
    queryset.update(flag='dirty')
make_unverified.short_description = (
    "Mark selected observations as unverified (dirty)")


class ObservationsAdmin(admin.ModelAdmin):
    list_display = (
        'gid',
        'user',
        'site',
        'obs_date',
        'score',
        'flag')
    list_filter = ('flag',)
    actions = [make_verified, make_unverified]


admin.site.register(Sites)
admin.site.register(Observations, ObservationsAdmin)