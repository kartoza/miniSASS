# admin.py

from django.contrib import admin
from minisass.models import Video

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)
