import { Component, OnDestroy, OnInit, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit,OnDestroy{
  form:FormGroup;
  
  successEvent = output<void>();

  subs=new Subscription();


  constructor(private fb: FormBuilder, protected service: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]*"),
        Validators.maxLength(8),  Validators.minLength(1)]],
      password: ["", [Validators.required, Validators.pattern(/^[\S]*$/),
        Validators.maxLength(20), Validators.minLength(8)]],
      password2: ["", [Validators.required, Validators.maxLength(20)]]
    },{
      validators: [this.checkPasswords]
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    let user = {
      "username": this.form.value['username'].toLowerCase(),
      "password1": this.form.value['password'],
      "password2": this.form.value['password2'],
    }

    this.subs.add(
      this.service.register(user).subscribe(
        {
          next: value => {
            alert("La usuario fue registrado con éxito")
            this.successEvent.emit()
          },
          error: err => {
            if(err["code"]==400){
              alert(err["error"]);
            }else{
              alert("Error "+ err.status+":" + err.message );
            }
          }
        }
      )
    );
  }

  exit(){
    this.router.navigate(["/login"]);
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('password2')?.value
    return pass === confirmPass ? null : { notSame: true }
  }
}