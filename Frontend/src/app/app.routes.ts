import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordComponent } from './components/password/password.component';
import { authGuard, authGuardAdmin } from './guards/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { ShowUserComponent } from './components/show-user/show-user.component';
import { DisplayListComponent } from './components/display-list/display-list.component';
import { ManageListComponent } from './components/manage-list/manage-list.component';
import { LinesComponent } from './components/lines/lines.component';
import { AboutComponent } from './components/about/about.component';
import { TicketsComponent } from './components/tickets/tickets.component';

export const routes: Routes = [
    {path:"",component:HomeComponent},
    {path:"login",component:LoginComponent, title:"Iniciar Secion"},
    // {path:"password",component:PasswordComponent, title:"Cambiar Contraseña"},
    {path:"display",component:DisplayListComponent, title:"Mostrar"},
    {path:"about",component:AboutComponent, title:"Acerca De"},
    {path:"manage",component:ManageListComponent, title:"Gestion listas", canActivate:[authGuard]},
    {path:"tickets",component:TicketsComponent, title:"Todos los tickets", canActivate:[authGuard]},

    {path:"showuser",component:ShowUserComponent, title:"Mi usuario", canActivate:[authGuard]},
    {path:"lines",component:LinesComponent, title:"Lineas de Ticket", canActivate:[authGuardAdmin]},
    // {path:"register",component:RegisterComponent, title:"Registo", canActivate:[authGuardAdmin]},
    {path:"users",component:UsersComponent, title:"Usuarios", canActivate:[authGuardAdmin]},

    {path:"**", redirectTo:""},
];
