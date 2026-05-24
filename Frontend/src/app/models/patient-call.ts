import { User } from './user';
export class PatientCall {
  id=0;
  patient="";
  user="";
  date="";

  constructor(patient:string,user:string=""){
    this.patient=patient
    this.user=user
  }
}
