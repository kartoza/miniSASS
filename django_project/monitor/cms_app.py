from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import gettext_lazy as _

class MonitorApp(CMSApp):
    name = _("Monitor App")
    urls = ["monitor.urls"]

apphook_pool.register(MonitorApp)
