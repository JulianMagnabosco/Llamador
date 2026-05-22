from django import forms

class LineForm(forms.Form):
    name = forms.CharField(label="Name",max_length=1000,min_length=1)
    code = forms.CharField(label="Code",max_length=100,min_length=1)