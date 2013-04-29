from django import forms
from monitor.models import Sites, Observations
from django.forms import ModelForm, Textarea, Select, DateInput

# Form based on the Sites model
class SiteForm(ModelForm):
    class Meta:
        model = Sites
        exclude = ('time_stamp','user')
        widgets = {
            'description': Textarea(attrs={'cols':30, 'rows':4}),
            'river_cat': Select(attrs={'onchange':"updateInputForm('');"}),
        }

# Form based on the Observations model
class ObservationForm(ModelForm):
    flatworms = forms.BooleanField(required=False,label='Flat worms',widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('flatworms');"}))
    worms = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('worms');"}))
    leeches = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('leeches');"}))
    crabs_shrimps = forms.BooleanField(required=False,label='Crabs or Shrimps',widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('crabs_shrimps');"}))
    stoneflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('stoneflies');"}))
    minnow_mayflies = forms.BooleanField(required=False,label='Minnow mayflies',widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('minnow_mayflies');"}))
    other_mayflies = forms.BooleanField(required=False,label='Other mayflies',widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('other_mayflies');"}))
    damselflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('damselflies');"}))
    dragonflies = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('dragonflies');"}))
    bugs_beetles = forms.BooleanField(required=False,label='Bugs or beetles',widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('bugs_beetles');"}))
    caddisflies = forms.BooleanField(required=False,label='Caddisflies',widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('caddisflies');"}))
    true_flies = forms.BooleanField(required=False,label='True flies',widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('true_flies');"}))
    snails = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs = {'onclick':"updateInputForm('snails');"}))
    class Meta:
        model = Observations
        exclude = ('time_stamp','user')
        widgets = {
            'obs_date': DateInput(attrs={'placeholder':'yyyy-mm-dd'}),
            'comment':  Textarea(attrs={'cols':30, 'rows':4}),
        }

# Form for storing lon/lat coordinates
class CoordsForm(forms.Form):
    latitude = forms.DecimalField(min_value=-90,max_value=90,widget=forms.TextInput(attrs = {'value':'0.00000'}))
    longitude = forms.DecimalField(min_value=-180,max_value=180,widget=forms.TextInput(attrs = {'value':'0.00000'}))

# Form for map view and data input parameters
class MapForm(forms.Form):
    zoom_level = forms.CharField()
    centre_X = forms.CharField()
    centre_Y = forms.CharField()
    layers = forms.CharField()
    edit_site = forms.CharField()
    error = forms.CharField()

