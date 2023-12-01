from django.contrib import admin
from minisass.models import GroupScores,Video

@admin.register(GroupScores)
class GroupScoresAdmin(admin.ModelAdmin):
    list_display = ('name','sensitivity_score',)
    search_fields = ('name',)

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)
