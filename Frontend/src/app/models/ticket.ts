import { User } from './user';
export class Ticket {
  id=0;
  number=1;
  code="";
  user="";
  selected=false;
  callerId="";
  date="";
  withTurn=false;

  constructor(code:string,number:number,user:string=""){
    this.code=code
    this.number=number
    this.user=user
  }
}
