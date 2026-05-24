import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { RegisterComponent } from "../register/register.component";


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RegisterComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit,OnDestroy{

  users:User[]=[];

  subs:Subscription=new Subscription;
  selectedUser:User|undefined;

  password=""
  newPassword=""

  constructor(private service:UserService, private authService:AuthService){
  }
  
  ngOnInit(): void {
    this.charge()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  selectUser(user:User){
    this.selectedUser=user
  }


  savePassword(){
    const data = {
      "username":this.selectedUser?.username,
      "password1":this.password,
      "password2":this.newPassword,
    }
    this.subs.add(this.authService.changePassword(data).subscribe({
      next: value => {
        alert("Exito")
        this.password=""
        this.newPassword=""
      },
      error: err => {
        if(err.status == 404 || err.status == 401){
          alert("Error credenciales incorrectas");
          return
        }
        alert("Error "+ err.status+":" + err.message );
      },
    }))
  }



  charge(){
    this.subs.add(
      this.service.getAll().subscribe(
        {
          next: value => {
            this.users=value["list"]
          },
          error: err => {
            alert("Error "+ err.status+":" + err.message );
          }
        }
      )
    );
    
  }


  deleteUser(id:number){
    if(confirm("¿Eliminar usuario?")){
      this.subs.add(
        this.service.delete(id.toString()).subscribe({
          next: value => {
            alert("Eliminado");
            // alert("Añadido al carrito");
            this.charge()
          },
          error:err => {
            // alert("Hubo un error al añadir al carrito");
            if(err.status == 403 || err.status == 401){
              return
            }
            alert("Error "+ err.status+":" + err.message );
          }
        })
      )
    
    }
  }


}


