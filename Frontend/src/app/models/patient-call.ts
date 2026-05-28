import { User } from './user';
export class PatientCall {
  id=0;
  patient="";
  room="";
  date="";

  constructor(patient:string,room:string=""){
    this.patient=patient
    this.room=room
  }
}
