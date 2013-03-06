from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import ugettext_lazy as _

from monitor.menu import MonitorMenu

class MonitorApp(CMSApp):
    name = _(u"Monitor App")
    urls = ["monitor.urls"]
    menus = [MonitorMenu]

apphook_pool.register(MonitorApp)
