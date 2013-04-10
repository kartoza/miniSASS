from django import forms
from monitor.models import Sites, Observations
from django.forms import ModelForm, Textarea, DateInput

# Form based on the Sites model
class SiteForm(ModelForm):
    class Meta:
        model = Sites
        widgets = {
            'description': Textarea(attrs={'cols':30, 'rows':4}),
        }

# Form based on the Observations model
class ObservationForm(ModelForm):
    flatworms = forms.BooleanField(required=False,label='Flat worms',widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    worms = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    leeches = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    crabs_shrimps = forms.BooleanField(required=False,label='Crabs or Shrimps',widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    stoneflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    minnow_mayflies = forms.BooleanField(required=False,label='Minnow mayflies',widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    other_mayflies = forms.BooleanField(required=False,label='Other mayflies',widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    damselflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    dragonflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    bugs_beetles = forms.BooleanField(required=False,label='Bugs or beetles',widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    caddisflies = forms.BooleanField(required=False,label='Caddisflies',widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    true_flies = forms.BooleanField(required=False,label='True flies',widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    snails = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateScore();"}))
    class Meta:
        model = Observations
        exclude = ('site','time_stamp','user')
        widgets = {
            'obs_date': DateInput(attrs={'placeholder':'yyyy-mm-dd'}),
            'comment':  Textarea(attrs={'cols':30, 'rows':4}),
        }

# Form for storing lon/lat coordinates
class CoordsForm(forms.Form):
    latitude = forms.DecimalField(min_value=-90,max_value=90,widget=forms.TextInput(attrs = {'value':'0.00000'}))
    longitude = forms.DecimalField(min_value=-180,max_value=180,widget=forms.TextInput(attrs = {'value':'0.00000'}))

# Form for storing map parameters
class MapForm(forms.Form):
#    zoom_level = forms.CharField(widget=forms.HiddenInput)
    zoom_level = forms.CharField()
    centre_X = forms.CharField()
    centre_Y = forms.CharField()
    layers = forms.CharField()

