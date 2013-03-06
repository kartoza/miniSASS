from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from monitor.models import ObservationPlugin as ObservationPluginModel
from django.utils.translation import ugettext as _


class ObservationPlugin(CMSPluginBase):
    model = ObservationPluginModel
    name = _(u"Observation Plugin")
    render_template = "monitor/plugin.html"

    def render(self, context, instance, placeholder):
        context.update({'instance':instance})
        return context

plugin_pool.register_plugin(ObservationPlugin)
