from django.contrib import admin

from monitor.models import Sites
from monitor.models import Observations

admin.site.register(Sites)
admin.site.register(Observations)
