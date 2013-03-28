from django import forms
from monitor.models import Sites, Observations
from django.forms import ModelForm, Textarea


class SiteForm(ModelForm):
    class Meta:
        model = Sites
        widgets = {
            'description': Textarea(attrs={'cols':30, 'rows':4}),
        }

class CoordsForm(forms.Form):
    latitude = forms.DecimalField(min_value=-90,max_value=90)
    longitude = forms.DecimalField(min_value=-180,max_value=180)

class ObservationForm(ModelForm):
    flatworms = forms.BooleanField(required=False,label='Flat worms',widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    worms = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    leeches = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    crabs_shrimps = forms.BooleanField(required=False,label='Crabs or Shrimps',widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    stoneflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    minnow_mayflies = forms.BooleanField(required=False,label='Minnow mayflies',widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    other_mayflies = forms.BooleanField(required=False,label='Other mayflies',widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    damselflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    dragonflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    bugs_beetles = forms.BooleanField(required=False,label='Bugs or beetles',widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    caddisflies = forms.BooleanField(required=False,label='Caddisflies (cased and uncased)',widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    true_flies = forms.BooleanField(required=False,label='True flies',widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    snails = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick' : "updateScore();"}))
    class Meta:
        model = Observations
        exclude = ('site','time_stamp','user')
        widgets = {
            'comment':  Textarea(attrs={'cols':30, 'rows':4}),
        }

