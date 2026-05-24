from django.db import models
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User

# Create your models here.
class PatientCall(models.Model):

    user=models.ForeignKey(User,blank=True,null=True,on_delete=models.SET_NULL,related_name="tickets")

    patient=models.CharField(max_length=200,default="")
    
    date = models.DateTimeField(auto_now_add=True)
    
    def json(self):
        return {"id":self.pk,
                "user":self.user.username if self.user else None,
                "patient":self.patient,
                "date":self.date.isoformat()}
        
    async def ajson(self):
        creator = await sync_to_async(self.user)()
        return {"id":self.pk,
                "user":creator.username if creator else None,
                "patient":self.patient,
                "date":self.date.isoformat()}

    def __str__(self):
        return self.patient+" "+self.date.strftime("%Y-%m-%d %H:%M:%S:%f")