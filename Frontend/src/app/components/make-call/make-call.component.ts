import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PatientCallsService } from '../../services/patientcalls.service';

@Component({
  selector: 'app-make-call',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './make-call.component.html',
  styleUrl: './make-call.component.css'
})
export class MakeCallComponent implements OnInit,OnDestroy{
  private subs: Subscription = new Subscription();
  loading=false
  form: FormGroup;

  constructor(private fb: FormBuilder, protected service: PatientCallsService, private router: Router) {
    this.form = this.fb.group({
      patient: ["", [Validators.required, Validators.maxLength(20)]]
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
    let data = {
      "patient": this.form.value['patient'].toUpperCase()
    }
    this.subs.add(
      this.service.addCall(data).subscribe(
        {
          next: value => {
            this.form.reset()
            alert("Llamado creado con exito")
            this.loading=false
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
}
