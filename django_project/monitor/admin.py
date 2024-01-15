from django.contrib import admin

from monitor.forms import ObservationPestImageForm
from .models import (
    Assessment,
    Sites,
    Observations,
    SiteImage,
    ObservationPestImage,
    Pest
)


def make_verified(modeladmin, request, queryset):
    for observation in queryset:
        observation.flag = 'clean'
        observation.save()
make_verified.short_description = "Mark selected observations as verified (clean)"


def make_unverified(modeladmin, request, queryset):
    for observation in queryset:
        observation.flag = 'dirty'
        observation.save()
make_unverified.short_description = "Mark selected observations as unverified (dirty)"


class ObservationPestImageInline(admin.TabularInline):
    model = ObservationPestImage
    form = ObservationPestImageForm
    autocomplete_fields = ('group',)

@admin.register(Observations)
class ObservationsAdmin(admin.ModelAdmin):
    list_display = (
        'gid',
        'user',
        'site',
        'obs_date',
        'score',
        'minisass_ml_score',
        'ml_model_version',
        'ml_model_type',
        'flag',
        'is_validated'
    )
    list_filter = ('flag', 'is_validated')
    search_fields = ('site__site_name', 'site__river_name')
    autocomplete_fields = ('site', 'user')
    actions = [make_verified, make_unverified]
    inlines = (ObservationPestImageInline,)


class SiteImageInline(admin.TabularInline):
    model = SiteImage


@admin.register(Sites)
class SitesAdmin(admin.ModelAdmin):
    list_max_show_all = 1000
    list_display = (
        'site_name',
        'user',
        'river_name',
    )
    list_filter = ('river_cat', )
    search_fields = ('site_name', 'river_name')
    inlines = (SiteImageInline,)


admin.site.register(Pest, admin.ModelAdmin)
admin.site.register(ObservationPestImage)
admin.site.register(Assessment, admin.ModelAdmin)
