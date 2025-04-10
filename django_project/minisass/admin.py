from django.contrib import admin
from minisass.models import (
    GroupScores,
    Video,
    MobileApp,
    PrivacyPolicy,
    PrivacyPolicyConsent
)

@admin.register(GroupScores)
class GroupScoresAdmin(admin.ModelAdmin):
    list_display = ('name', 'sensitivity_score', 'db_field')
    search_fields = ('name',)

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)


@admin.register(MobileApp)
class MobileApp(admin.ModelAdmin):
    list_display = ['name', 'active', 'date']
    list_filter = ['active']
    search_fields = ['name']

@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    list_display = ('version', 'link', 'file', 'published_at')

@admin.register(PrivacyPolicyConsent)
class PrivacyPolicyConsentAdmin(admin.ModelAdmin):
    list_display = ('user', 'policy', 'consent_given', 'consent_date', 'ip_address')
