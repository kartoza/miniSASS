from django.contrib import admin

from monitor.models import Sites
from monitor.models import Observations
from monitor.models import ArchivedSites
from monitor.models import ArchivedObservations


def make_verified(modeladmin, request, queryset):
    # Ismail Sunni: I use this (not using queryset.update(flag='clean'))
    # since we need to do save for send signal
    for observation in queryset:
        observation.flag = 'clean'
        observation.save()
make_verified.short_description = (
    "Mark selected observations as verified (clean)")


def make_unverified(modeladmin, request, queryset):
    # Ismail Sunni: I use this (not using queryset.update(flag='dirty'))
    # since we need to do save for send signal
    for observation in queryset:
        observation.flag = 'dirty'
        observation.save()
make_unverified.short_description = (
    "Mark selected observations as unverified (dirty)")


class ObservationsAdmin(admin.ModelAdmin):
    list_display = (
        'gid',
        'user',
        'site',
        'obs_date',
        'score',
        'flag'
    )
    list_filter = ('flag',)
    actions = [make_verified, make_unverified]


class ArchivedObservationsAdmin(admin.ModelAdmin):
    list_display = (
        'gid',
        'user_id',
        'site_id',
        'obs_date',
        'score',
        'flag'
    )
    list_filter = ('flag',)


admin.site.register(Sites)
admin.site.register(Observations, ObservationsAdmin)
admin.site.register(ArchivedSites)
admin.site.register(ArchivedObservations, ArchivedObservationsAdmin)