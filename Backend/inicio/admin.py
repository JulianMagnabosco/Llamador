from django.contrib import admin

# Register your models here.
from .models import PatientCall

admin.site.register(PatientCall)
