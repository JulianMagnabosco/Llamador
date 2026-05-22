import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.shortcuts import aget_object_or_404
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User

from .models import Line,Ticket

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        # print(self.scope)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        username = self.scope["user"].username
        try:
            user = await aget_object_or_404(User,username=username)
        except:
            errorMessage = {"type":"error","code":401,"message":"User not authenticated"}
            await self.send(text_data=json.dumps({"type": "chat.message", "message": errorMessage}))
            return
        
        if message["type"]=="add" :
            line = await aget_object_or_404(Line,code=message["code"])
            list = line.getTickets()
            totem = message["totem"]

            lastTicket = await sync_to_async(list.last)()
            lastTicketNumber = lastTicket.number if not lastTicket is None else 99
            newNumber = lastTicketNumber+1 if lastTicketNumber<99 else 1
            await Ticket.asave(Ticket(number=newNumber,line=line,totem=totem))
            
        elif message["type"]=="call":
            ticket = await aget_object_or_404(Ticket,pk=message["id"])
            ticket.user = user
            await Ticket.asave(ticket)

        elif message["type"]=="del":
            ticket = await aget_object_or_404(Ticket,pk=message["id"])
            await Ticket.adelete(ticket)

        elif message["type"]=="dellist" :
            for t in message["tickets"]:
                ticket = await aget_object_or_404(Ticket,pk=t["id"])
                await Ticket.adelete(ticket)

        await self.getAll()

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
        
    async def getAll(self):
    # if not request.user.is_authenticated:
    #     return JsonResponse({"login": False},status=401)
        username = self.scope["user"].username
        # print(self.scope["user"].is_superuser)
        listRaw0 = Ticket.objects.select_related("user").select_related("line").filter(user=None).order_by("date")

        # if not self.scope["user"].is_superuser:
        #     listRaw1 = listRaw0.filter(line__users__username=username).all() 
        # else:
        listRaw1 = listRaw0.all() 

        listValues=list()
        async for t in listRaw1:
            listValues.append(t.json())

        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", 
            "message": {
                "data": listValues,
                "type": "update"
            }
        })