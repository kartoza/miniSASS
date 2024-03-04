from django.contrib import admin
import csv
from django.http import HttpResponse

from monitor.forms import ObservationPestImageForm
from .models import (
    Assessment,
    Sites,
    Observations,
    SiteImage,
    ObservationPestImage,
    Pest
)
from .forms import DateRangeForm


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
    list_filter = ('flag', 'is_validated',('obs_date', admin.DateFieldListFilter)
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
        form = DateRangeForm(request.POST or None)  # Initialize the form

        if form.is_valid():
            start_date = form.cleaned_data.get('start_date')
            end_date = form.cleaned_data.get('end_date')

            queryset = queryset.filter(obs_date__range=[start_date, end_date])
            
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="observations.csv"'

        writer = csv.writer(response)
        # testing TODO add all rows
        writer.writerow(['obs_date'])

        for obj in queryset:
            writer.writerow([obj.obs_date])

        return response
    download_records.short_description = "Download selected records"


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


admin.site.register(ObservationPestImage)
admin.site.register(Assessment, admin.ModelAdmin)
