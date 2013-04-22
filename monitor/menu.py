from cms.menu_bases import CMSAttachMenu
from menus.base import Menu, NavigationNode
from menus.menu_pool import menu_pool
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from monitor.models import Observations


class MonitorMenu(CMSAttachMenu):
    name = _(u"Observations Menu")

    def get_nodes(self, request):
        """ Build the menu tree of observation records
        """
        nodes = []
        for observation in Observations.objects.all().order_by('-time_stamp'):
            node = NavigationNode(
                    observation.nearest_place_name,
                    reverse('monitor.views.detail', args=(observation.pk,)),
                    observation.pk
                )
            nodes.append(node)
        return nodes

menu_pool.register_menu(MonitorMenu)
