from django.db import models
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User

# Create your models here.
class Line(models.Model):
    name=models.CharField(max_length=1000)
    code=models.CharField(max_length=100)
    
    users = models.ManyToManyField(User,blank=True)
    ticket_list=[]

    def getTickets(self):
        return Ticket.objects.filter(line=self).order_by("date")
    
    def json(self):
        return {"id":self.pk,"name":self.name,"code":self.code,"tickets":list(self.getTickets().values())}
    
    async def ajson(self):
        tks = self.getTickets().filter(user=None)
        listA = await sync_to_async(tks.values)()
        newList = await sync_to_async(list)(listA)
        return {"id":self.pk,"name":self.name,"code":self.code,"tickets":newList}

    def __str__(self):
        return self.name+"("+self.code+")"
    
class Ticket(models.Model):
    number=models.IntegerField()
    line=models.ForeignKey(Line,on_delete=models.CASCADE,related_name="tickets")
    totem=models.CharField(max_length=100,default="")

    user=models.ForeignKey(User,blank=True,null=True,on_delete=models.SET_NULL,related_name="tickets")
    
    date = models.DateTimeField(auto_now_add=True)
    
    def json(self):
        return {"id":self.pk,
                "code":self.line.code,
                "withTurn": "ntrada con turno" in self.line.name.lower(),
                "number":self.number,
                "totem":self.totem,
                "user":self.user.username if self.user else None,
                "date":self.date.isoformat()}
        
    async def ajson(self):
        ticketLine = await sync_to_async(self.line)()
        ticketUser = await sync_to_async(self.user)()
        return {"id":self.pk,
                "code":ticketLine.code,
                "withTurn": "ntrada con turno" in ticketLine.name.lower(),
                "number":self.number,
                "totem":self.totem,
                "user":ticketUser.username if self.user else None,
                "date":self.date.isoformat()}

    def __str__(self):
        return self.line.code+"-"+str(self.number)+" "+self.date.strftime("%Y-%m-%d %H:%M:%S:%f")