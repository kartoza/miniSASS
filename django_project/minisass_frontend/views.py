from django.http import HttpResponse
from django.views.generic import TemplateView
from django.conf import settings


class ReactHomeView(TemplateView):
    template_name = "react_base.html"

    def get_context_data(self, **kwargs):
        ctx = super(ReactHomeView, self).get_context_data(
            **kwargs
        )
        ctx['dev_mode'] = settings.DEBUG
        return ctx
