import requests
import logging

from xml.etree import ElementTree as ET
from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from django.utils.translation import gettext as _

from .models import RSSFeedConfig

logger = logging.getLogger('rss-feed-plugin')

class RSSFeedPlugin(CMSPluginBase):
    model = RSSFeedConfig
    name = _('RSS Feed Plugin')
    render_template = 'cmsplugin_rssfeed/rss_feed.html'

    def render(self, context, instance, placeholder):
        feed_url = instance.feed_url
        feed = []
        try:
            response = requests.get(feed_url)
            if response.status_code == 200:
                root = ET.XML(response.content)
                items = root.find('channel').findall('item')
                for item in items:
                    feed.append({
                        'title': item.find('title').text,
                        'link': item.find('link').text,
                        'description': item.find('description').text,
                        'pub_date': item.find('pubDate').text[:22],
                        'creator': item.find('{http://purl.org/dc/elements/1.1/}creator').text
                    })
            else:
                logger.error("Response Error: %s - %s", response.status_code, response.reason)
        except requests.exceptions.RequestException:
            logger.error("Could not connect to host %s", feed_url)

        context['feed'] = feed
        return context

plugin_pool.register_plugin(RSSFeedPlugin)
