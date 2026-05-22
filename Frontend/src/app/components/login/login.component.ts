import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,OnDestroy{
  private subs: Subscription = new Subscription();
  loading=false
  form: FormGroup;

  constructor(private fb: FormBuilder, protected service: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ["", [Validators.required, Validators.maxLength(20)]],
      password: ["", [Validators.required, Validators.maxLength(20)]]
    });

  }

  ngOnInit(): void {
    this.form.updateValueAndValidity()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.loading=true
    let user = {
      "username": this.form.value['username'].toLowerCase(),
      "password": this.form.value['password'],
    }
    this.subs.add(
      this.service.login(user).subscribe(
        {
          next: value => {
            this.service.setData(value["user"])
            this.loading=false
            this.router.navigate(["/home"])
          },
          error: err => {
            if(err["status"]==401){
              alert("No existe usuario con esas credenciales");
              // alert("No existe usuario con esas credenciales")
            }else {
              alert("Error "+ err.status+":" + err.message );
            }
            this.loading=false
          },
        }
      )
    );
  }

  exit(){
    this.router.navigate(["/register"]);
  }

  // checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
  //   let pass = group.get('password')?.value;
  //   let confirmPass = group.get('password2')?.value
  //   return pass === confirmPass ? null : { notSame: true }
  // }

}
