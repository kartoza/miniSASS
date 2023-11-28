
from django.contrib import admin
from minisass.models import GroupScores

@admin.register(GroupScores)
class GroupScoresAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
