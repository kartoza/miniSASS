from django.db import models


class Lookup(models.Model):
    """ Provides a lookup table for populating drop-down lists
    """
    container = models.ForeignKey(
            'self', 
            limit_choices_to={'active':True, 'container':None}, 
            blank=True, null=True)
    rank = models.PositiveIntegerField(
            default=0)
    description = models.CharField(
            max_length=50, 
            blank=False)
    active = models.BooleanField(
            default=True)

    def __unicode__(self):
        return self.description
