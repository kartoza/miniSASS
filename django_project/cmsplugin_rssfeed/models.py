from django.db import models
from cms.models import CMSPlugin

class RSSFeedConfig(CMSPlugin):
    feed_url = models.URLField()

    def __unicode__(self):
        return self.feed_url
