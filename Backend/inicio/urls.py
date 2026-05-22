from django.urls import path
from . import views

urlpatterns = [

    path("api/trigger/", views.trigger_mensaje),

    path('api/user/', views.getUsers),
    path('api/me/', views.myUser),
    path('api/user/<int:id>/', views.user),
    path('api/userlines/', views.userLines),

    path('api/signup/', views.api_signup),
    path('api/logout/', views.api_signout),
    path('api/signin/', views.api_signin),
    path('api/resetpass/', views.api_resetpass),

    path("api/tickets/", views.getAll),
    path("api/search/", views.searchTickets),
    path("api/lines/", views.getLines),
    path("api/line/", views.addLine),
    path("api/line/<int:id>/", views.deleteLine),
    
    path("api/ticket/", views.addTicket),
    path("api/ticket/list/", views.addTicketList),
    path("api/ticket/<int:id>/", views.deleteTicket),
]