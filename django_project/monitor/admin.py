from django.contrib import admin
from .models import (
    Sites, Observations, SiteImage, ObservationPestImage, Pest
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

@admin.register(Observations)
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
    inlines = (SiteImageInline,)


admin.site.register(Pest, admin.ModelAdmin)
