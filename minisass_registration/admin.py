from django.contrib import admin

from minisass.models import Lookup


class LookupAdmin(admin.ModelAdmin):
    list_display = ('container', 'description', 'active',)
    list_display_links = ('description',)
    ordering = ('container', 'description',)
    search_fields = ('description',)
    list_editable = ('active',)
    list_filter = ('active', 'container', )

admin.site.register(Lookup, LookupAdmin)
