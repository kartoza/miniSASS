from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from cms.models import CMSPlugin
from django.utils.translation import gettext as _

from monitor.models import Observations as Observation

class LatestObservationsPlugin(CMSPluginBase):
    model = CMSPlugin  # Use the CMSPlugin model as the base
    name = _("Latest Observations Plugin")
    render_template = "monitor/latest_plugin.html"

    def render(self, context, instance, placeholder):
        context['instance'] = instance
        
        # Get the latest 8 observations
        latest = Observation.objects.all().order_by('-time_stamp').values(
            'gid', 'site__site_name', 'site__river_name', 'user__username', 'user__userprofile__organisation_name', 'score', 'time_stamp')[:8]
        context['latest'] = latest

        return context

plugin_pool.register_plugin(LatestObservationsPlugin)
