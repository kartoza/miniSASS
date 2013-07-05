from django.http import HttpResponse
from django.utils import simplejson as json

from monitor.models import Schools


def school_names(request):
    """ Return school names matching the string passed in
    """
    result = []
    query = request.GET.get('term')
    if query:
        qs = Schools.objects.filter(school__istartswith=query).values('school')
        result = [itm['school'] for itm in qs]
    content = json.dumps(result)
    return HttpResponse(content, 
                        content_type="application/json; charset=utf-8")
