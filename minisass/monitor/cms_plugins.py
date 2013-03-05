from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from monitor.models import MonitorPlugin as MonitorPluginModel
from django.utils.translation import ugettext as _


class MonitorPlugin(CMSPluginBase):
    model = MonitorPluginModel
    name = _(u"Monitor Plugin")
    render_template = "monitor/plugin.html"

    def render(self, context, instance, placeholder):
        context.update({'instance':instance})
        return context

plugin_pool.register_plugin(MonitorPlugin)
