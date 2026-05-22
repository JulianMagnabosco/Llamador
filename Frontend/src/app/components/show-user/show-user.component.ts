import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgIf, UpperCasePipe } from '@angular/common';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-show-user',
  standalone: true,
  imports: [NgIf],
  templateUrl: './show-user.component.html',
  styleUrl: './show-user.component.css'
})
export class ShowUserComponent implements OnInit,OnDestroy{
  user=new User();
  found=false;

  quantity=1;

  subs:Subscription=new Subscription;
  
  constructor(private activatedRoute:ActivatedRoute,  private service:UserService, private authService:AuthService ){
    
  }
  ngOnInit(): void {
    this.charge()

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  

  charge(){
    
    this.subs.add(
      this.service.get(this.authService.user?.id.toString()||"").subscribe(
        {
          next: value => {
            this.user=value
            this.found=true;
          },
          error: err => {
            this.found=false;
          }
        }
      )
    );
  }

}
