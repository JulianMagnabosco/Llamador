import { TicketList } from "./ticket-list";

export class User {
  id=0;
  username="";
  admin=false;
  email="";
  lines:TicketList[]=[]
}
