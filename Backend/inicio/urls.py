from django.urls import path
from . import views

urlpatterns = [

    path("api/trigger/", views.trigger_mensaje),

    path('api/user/', views.getUsers),
    path('api/me/', views.myUser),
    path('api/user/<int:id>/', views.user),

    path('api/signup/', views.api_signup),
    path('api/logout/', views.api_signout),
    path('api/signin/', views.api_signin),
    path('api/resetpass/', views.api_resetpass),

    path("api/addcall/", views.addCall),
    path("api/getcalls/", views.getCalls),
    path("api/dellcall/<int:id>/", views.dellCall),
]