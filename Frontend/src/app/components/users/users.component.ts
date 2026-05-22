import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { TicketList } from '../../models/ticket-list';
import { TicketsService } from '../../services/tickets.service';
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
  lines:TicketList[]=[];

  subs:Subscription=new Subscription;
  selectedUser:User|undefined;

  password=""
  newPassword=""

  constructor(private service:UserService, private authService:AuthService ,private ticketService:TicketsService ){
  }
  
  ngOnInit(): void {
    this.charge()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  selectUser(user:User){
    this.selectedUser=user
    this.lines.forEach((t)=>{
      const lu = user.lines.find((lu)=>lu.code==t.code)
      t.selected=!!lu
    })
  }

  selectLine(line:TicketList){
    line.selected=!line.selected
    console.log("ad")
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

  applylines(){
    if(!this.selectedUser) return
    const data={
      lines: this.lines.map((l)=>{
        return {selected:l.selected,code:l.code}
      }),
      user: this.selectedUser?.id
    }
    this.subs.add(
      this.ticketService.setLines(data).subscribe(
        {
          next: value => {
            alert("Exito")
            this.selectedUser=undefined
            this.charge()
          },
          error: err => {
            alert("Error "+ err.status+":" + err.message );
          }
        }
      )
    );
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
    
    this.subs.add(
      this.ticketService.getLines().subscribe(
        {
          next: value => {
            this.lines=value["data"]
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


