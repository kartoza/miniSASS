from cms.menu_bases import CMSAttachMenu
from menu.base import Menu, NavigationNode
from menus.menu_pool import menu_pool
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from monitor.models import miniSASSmonitor


class MonitorMenu(CMSAttachMenu):
    name = _(u"Monitor Menu")

    def get_nodes(self, request):
        """ Build the menu tree of monitor records
        """
        nodes = []
        for monitor in miniSASSmonitor.objects.all().order_by('-date_created'):
            node = NavigationNode(
                    monitor.nearest_place_name,
                    reverse('monitor.views.detail', args=(monitor.pk,)),
                    monitor.pk
                )
            nodes.append(node)
        return nodes

menu_pool.register_menu(MonitorMenu)
