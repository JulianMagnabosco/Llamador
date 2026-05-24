from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.core.paginator import Paginator

from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import PatientCall
import json

from piper.voice import PiperVoice
import soundfile as sf
import numpy as np
import io


MODEL_PATH = "./tts_models/es_ES-davefx-medium.onnx"  # Cambiar por ruta real

voice = PiperVoice.load(MODEL_PATH)

#TTS
def tts(request):
    text = request.GET.get('text')  # Get a single value
    if not text:
        return JsonResponse({'error': 'Falta el texto'})

    # Generar audio y extraer datos desde AudioChunk
    chunks = list(voice.synthesize(text))
    audio_data = np.concatenate([chunk.audio_float_array for chunk in chunks])  # .data es ndarray de float32

    # Guardar en WAV en memoria
    buffer = io.BytesIO()
    sf.write(buffer, audio_data, voice.config.sample_rate, format='WAV', subtype='PCM_16')
    buffer.seek(0)

    response = HttpResponse(buffer, content_type="audio/wav")
    response["Content-Disposition"] = 'inline; filename="voz.wav"'
    return response

#WebSocket
def trigger_mensaje(request):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "chat_lobby",
        {"type": "chat.message", "message": {"data":"hola","type":"doupdate"}}
    )
    return JsonResponse({"status": "mensaje enviado por WebSocket"})

def chat(request):
    return render(request, "chat.html")

def room(request, room_name):
    return render(request, "room.html", {"room_name": room_name})


#API
@csrf_exempt
def myUser(request):
    myUser = request.user
    if not myUser.is_authenticated:
        return JsonResponse({"error":"No encontrado"},status=404)
    userJson = {"id":myUser.id,"username":myUser.username,"admin":myUser.is_superuser}
    return JsonResponse(userJson)

@csrf_exempt
def user(request,id):
    
    user = User.objects.get(id=id)
    if not user:
        return JsonResponse({"error":"No encontrado"},status=404)
    userJson = {"id":user.id,"username":user.username,"admin":user.is_superuser}
    if request.method == "DELETE":
        user.delete()
        return JsonResponse(userJson)
    return JsonResponse(userJson)


@csrf_exempt
def getUsers(request):
    if not request.user.is_superuser:
        return JsonResponse({"login": False},status=401)
    
    users = User.objects.select_related("lines").order_by("id").values()
    userList = list()
    for u in list(users):

        userList.append({"id":u["id"],
                         "username":u["username"],
                         "admin":u["is_superuser"]})
    return JsonResponse({"list": userList})

@csrf_exempt
def api_signout(request):
    if not request.user.is_authenticated:
        return JsonResponse({"login": False},status=401)
    logout(request)
    return JsonResponse({"login": True})


@csrf_exempt
def api_signin(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user = authenticate(
            request, username=body['username'], password=body['password'])
        if user is None:
            return JsonResponse({"login": False},status=401)

        login(request, user)
        userJson = {"id":user.id,"username":user.username,"email":user.email,"admin":user.is_superuser}
        return JsonResponse({"login": True, "user": userJson, "token": get_token(request)})
    
@csrf_exempt
def api_signup(request):
    if request.method == 'POST':
        body = json.loads(request.body)

        if body["password1"] == body["password2"]:
            try:
                user = User.objects.create_user(
                    body["username"], password=body["password1"])
                user.save()
                userJson = {"id":user.id,"username":user.username,"email":user.email,"admin":user.is_superuser}
                return JsonResponse({"register": True, "user": userJson})
            except IntegrityError:
                return JsonResponse({"register": False, "error": "Username already exist"},status=400)

        return JsonResponse({"register": False, "error": "Passwords did not match."},status=400)

@csrf_exempt
def api_resetpass(request):
    if not request.user.is_superuser:
        return JsonResponse({"login": False},status=401)
    else:
        body = json.loads(request.body)
        admin = authenticate(
            request, username=request.user.username, password=body['password1'])
        user = User.objects.get(username=body['username'])
        if user is None or admin is None:
            return JsonResponse({"resetpassword": False, "error": "Not found or bad credentials"},status=404)
        
        
        user.set_password(body['password2'])
        user.save()
        return JsonResponse({"resetpassword": True})


@csrf_exempt
def getCalls(request):
    listRaw0 = PatientCall.objects.select_related("user").filter(user=None).order_by("date")
    listRaw1 = listRaw0.all() 

    listValues=list()
    for t in list(listRaw1):
        listValues.append(t.json())

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "chat_lobby",
        {
            "type": "chat.message", 
            "message": {
                "data": listValues,
                "type": "update"
            }
        }
    )
    return JsonResponse({"data": listValues})

@csrf_exempt
def addCall(request):
    if request.method == "POST":
        body = json.loads(request.body)
        user = get_object_or_404(User,pk=request.user.id)
        
        newCall = PatientCall(user=user,patient=body["patient"])
        newCall.save()
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "chat_lobby",
            {
                "type": "chat.message", 
                "message": {
                    "data": newCall.json(),
                    "type": "call"
                }
            }
        )
        return JsonResponse({"date": newCall.date,"patient": newCall.patient})
    return getCalls(request)


@csrf_exempt
def dellCall(request,id):
    if not request.user.is_authenticated:
        return JsonResponse({"login": False},status=401)
    if request.method == "DELETE":
        call = get_object_or_404(PatientCall,pk=id)
        PatientCall.delete(call)
    return getCalls(request)

