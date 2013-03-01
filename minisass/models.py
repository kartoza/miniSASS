#NB: this is a model from another project, just a filler or template for now...

from django.db import models
# Import separately
from django.contrib.gis.db import models # defines geometry field types
from django.contrib.auth.models import User # refers to auth_user table
from django.template.defaultfilters import escape
from django.core.urlresolvers import reverse

# Python imports
from datetime import datetime

# Create your models here.

