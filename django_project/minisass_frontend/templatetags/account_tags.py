from django import template

register = template.Library()

@register.simple_tag
def custom_account_tag():
    return "This is a custom account tag."
