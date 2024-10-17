import csv
from django.contrib import admin
from django.utils.encoding import smart_str
from django.http import HttpResponse
from minisass_authentication.models import UserProfile
from django.contrib.sites.models import Site

from monitor.forms import ObservationPestImageForm
from .models import (
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
    autocomplete_fields = ('group', )
    fields = ('group', 'image', 'image_preview', 'valid')
    readonly_fields = ('image_preview', )


@admin.register(Observations)
class ObservationsAdmin(admin.ModelAdmin):
    list_max_show_all = 1000
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
    list_filter = ('flag', 'is_validated',('obs_date', admin.DateFieldListFilter))
    search_fields = ('site__site_name', 'site__river_name')
    autocomplete_fields = ('site', 'user')
    actions = [make_verified, make_unverified, 'download_records']
    inlines = (ObservationPestImageInline,)

    def save_formset(self, request, form, formset, change):
        observation: Observations = form.instance
        for inline_form in formset.forms:
            # If the new observation image has changed
            if inline_form.has_changed():
                if inline_form.instance.id:
                    old_instance = ObservationPestImage.objects.get(id=inline_form.instance.id)

                    # if the group has changed e.g. from damselflies to dragonflies and marked as valid,
                    # set damselflies to False on observation
                    # set dragonflies to True on observation
                    if old_instance.group.db_field != inline_form.instance.group.db_field and inline_form.instance.valid:
                        setattr(observation, old_instance.group.db_field, False)
                        setattr(observation, inline_form.instance.group.db_field, True)
        super().save_formset(request, form, formset, change)
        observation.recalculate_score()

    def download_records(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="observations.csv"'

        writer = csv.writer(response)
        writer.writerow(
            [
                smart_str("User name"),
                smart_str("User Organization"),
                smart_str("User Country"),
                smart_str("User Expert Status"),
                smart_str("Obs Date"),
                smart_str("Site name"),
                smart_str("River name"),
                smart_str("River category"),
                smart_str("Latitude"),
                smart_str("Longitude"),
                smart_str("Flatworms"),
                smart_str("Worms"),
                smart_str("Leeches"),
                smart_str("Crabs/shrimps"),
                smart_str("Stoneflies"),
                smart_str("Minnow mayflies"),
                smart_str("Other mayflies"),
                smart_str("Damselflies"),
                smart_str("Dragonflies"),
                smart_str("Bugs/beetles"),
                smart_str("Caddisflies"),
                smart_str("True flies"),
                smart_str("Snails"),
                smart_str("Score"),
                smart_str("Status"),
                smart_str("Water clarity"),
                smart_str("Water temp"),
                smart_str("pH"),
                smart_str("Diss oxygen"),
                smart_str("diss oxygen unit"),
                smart_str("Elec cond"),
                smart_str("Elec cond unit"),
                smart_str("Comment")
            ])

        for obs in queryset:
            if obs.flag == 'clean':
                flag = 'Verified'
            else:
                flag = 'Unverified'
            try:
                user_profile = obs.user.userprofile
                user_organization_name = user_profile.organisation_name
                user_country = user_profile.country
                user_is_expert = user_profile.is_expert
            except (UserProfile.DoesNotExist, AttributeError):
                user_organization_name = "N/A"
                user_country = "N/A"
                user_is_expert = False

            obs_date_str = obs.obs_date.strftime('%Y-%m-%d')
            writer.writerow(
                [
                    smart_str(obs.user.username),
                    smart_str(user_organization_name),
                    smart_str(user_country),
                    smart_str(user_is_expert),
                    smart_str(obs_date_str),
                    smart_str(obs.site.site_name),
                    smart_str(obs.site.river_name),
                    smart_str(obs.site.river_cat),
                    smart_str(obs.site.the_geom.y),
                    smart_str(obs.site.the_geom.x),
                    smart_str(obs.flatworms),
                    smart_str(obs.worms),
                    smart_str(obs.leeches),
                    smart_str(obs.crabs_shrimps),
                    smart_str(obs.stoneflies),
                    smart_str(obs.minnow_mayflies),
                    smart_str(obs.other_mayflies),
                    smart_str(obs.damselflies),
                    smart_str(obs.dragonflies),
                    smart_str(obs.bugs_beetles),
                    smart_str(obs.caddisflies),
                    smart_str(obs.true_flies),
                    smart_str(obs.snails),
                    smart_str(obs.score),
                    smart_str(flag),
                    smart_str(obs.water_clarity),
                    smart_str(obs.water_temp),
                    smart_str(obs.ph),
                    smart_str(obs.diss_oxygen),
                    smart_str(obs.diss_oxygen_unit),
                    smart_str(obs.elec_cond),
                    smart_str(obs.elec_cond_unit),
                    smart_str(obs.comment)
                ])

        return response
    download_records.short_description = "Download selected observations"


class SiteImageInline(admin.TabularInline):
    model = SiteImage


@admin.register(Sites)
class SitesAdmin(admin.ModelAdmin):
    list_max_show_all = 1000
    list_display = (
        'site_name',
        'river_name',
        'user',
        'user_organization_name',
        'user_country',
        'user_is_expert',
        'time_stamp',
    )

    def user_organization_name(self, obj):
        user_profile = obj.user.userprofile if hasattr(obj.user, 'userprofile') else None
        return user_profile.organisation_name if user_profile else None

    def user_country(self, obj):
        user_profile = obj.user.userprofile if hasattr(obj.user, 'userprofile') else None
        return user_profile.country if user_profile else None

    def user_is_expert(self, obj):
        user_profile = obj.user.userprofile if hasattr(obj.user, 'userprofile') else None
        return user_profile.is_expert if user_profile else None

    user_organization_name.short_description = 'User Organization Name'
    user_country.short_description = 'User Country'
    user_is_expert.short_description = 'Is Expert'
    list_filter = ('river_cat', )
    search_fields = ('site_name', 'river_name')
    inlines = (SiteImageInline,)


    def download_selected_sites(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="selected_sites.csv"'

        writer = csv.writer(response)
        writer.writerow(
            [
                'Site Name', 
                'River Name', 
                'Description', 
                'River Category',
                'Site Location',
                'Created By',
                'User Organization Name',
                'User Expert Status',
                'User Country', 
                'Site Creation Date'
            ])

        for site in queryset:
            try:
                user_profile = site.user.userprofile
                user_organization_name = user_profile.organisation_name
                user_country = user_profile.country
                user_is_expert = user_profile.is_expert
            except (UserProfile.DoesNotExist, AttributeError):
                user_organization_name = "N/A"
                user_country = "N/A"
                user_is_expert = False
            writer.writerow(
                [
                    smart_str(site.site_name), 
                    smart_str(site.river_name), 
                    smart_str(site.description), 
                    smart_str(site.river_cat), 
                    smart_str(f"Longitude: {site.the_geom.x}, Latitude: {site.the_geom.y}"),
                    smart_str(site.user.email),
                    smart_str(user_organization_name),
                    smart_str(user_is_expert), 
                    smart_str(user_country),
                    smart_str(site.time_stamp)
                ]
            )

        return response

    download_selected_sites.short_description = "Download Selected Sites"

    actions = ['download_selected_sites']


admin.site.register(ObservationPestImage)
admin.site.unregister(Site)