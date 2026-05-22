import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgSwitch,NgSwitchCase,NgSwitchDefault],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent implements OnInit,OnDestroy{
  phase=0;
  loading=false;

  private subs: Subscription = new Subscription();

  emailForm: FormGroup;

  form: FormGroup;
  tips: { errors:string[]|null, passwordPoints:number}={ errors:null,passwordPoints:0 }

  constructor(private fb: FormBuilder, protected authService: AuthService, private router: Router) {
    this.emailForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });

    this.form = this.fb.group({
      token: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(8)]],
      password2: ["", [Validators.required, Validators.maxLength(50)]]
    },{
      validators: [this.checkPasswords]
    });

  }

  ngOnInit(): void {
    // this.subs.add(
    //   this.form.valueChanges.subscribe({
    //     next: value =>  {
    //       this.test();
    //     }
    //   }));
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  back(){
    this.phase=0
  }

  onSubmit(){
    this.loading=true
    this.subs.add(this.authService.requestChangePassword(
      this.emailForm.controls["email"].value).subscribe({
      next: value => {
        this.loading=false
        this.phase=1;
      },
      error: err => {
        this.loading=false
        if(err["status"]==404){
          alert("No existe usuario con ese mail");
        }else {
          alert("Error "+ err.status+":" + err.message );
        }
      }
    }))
  }

  saveSubmit(){
    this.loading=true
    let user = {
      "token": this.form.controls['token'].value,
      "password": this.form.controls['password'].value,
      "email": this.emailForm.controls['email'].value
    }
    this.subs.add(this.authService.changePassword(user).subscribe({
      next: value => {
        this.loading=false
        alert("Contraseña Guardada")
        this.router.navigate(["/home"])
      },
      error: err => {
        this.loading=false
        if(err["status"]==404){
          alert("Token Invalido");
        }else {
          alert("Error "+ err.status+":" + err.message );
        }
      }
    }))
  }
  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('password2')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

}
