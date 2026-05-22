import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Turnos';

  subs=new Subscription();

  constructor(protected service:AuthService, private router:Router){
    
  }
  ngOnInit(): void {
    this.subs.add(
      this.service.myUser().subscribe({
        error: ()=>{
          this.service.deleteData()
        }
      })
    )
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }


  logout() {
    this.subs.add(
      this.service.logout().subscribe({
        next: ()=> {
          alert("Sesion cerrada")
          this.service.deleteData()
          this.router.navigate(["/home"])
        },
        error: ()=>{
          alert("Sesion cerrada incorrectamente")
          this.service.deleteData()
          this.router.navigate(["/home"])
        }
      })
    )
  }
}
