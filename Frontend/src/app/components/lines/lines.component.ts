import { Component, OnDestroy, OnInit } from '@angular/core';
import { TicketsService } from '../../services/tickets.service';
import { TicketList } from '../../models/ticket-list';
import { Subscription } from 'rxjs';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lines',
  imports: [NgFor,FormsModule],
  templateUrl: './lines.component.html',
  styleUrl: './lines.component.css',
})
export class LinesComponent implements OnInit, OnDestroy {
  subs: Subscription = new Subscription();
  loading = false;

  list: TicketList[] = [
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"CO","CO"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"P","Pediatria"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"C","Clinica"),
  ];

  newCode=""
  newName=""

  constructor(private service: TicketsService) {}
  ngOnInit(): void {
    this.charge();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get codes(){
    return this.list.map((line)=>{
      return line.code
    })
  }

  charge() {
    this.loading = true;
    this.subs.add(
      this.service.getLines().subscribe({
        next: (value) => {
          this.list = value['data']
          console.log(value);
        },
        error: (err) => {
          alert(
"Error "+ err.status+":" + err.message          );
          this.charge()
        },
        complete: () => {
          this.loading = false;
        },
      })
    );
  }

  addLine(){
    let data = {
      code:this.newCode,
      name:this.newName
    }
    this.subs.add(
      this.service.addLines(data).subscribe({
        next: (value) => {
          alert(
            'Agregada '+this.newName
          );
          this.charge()
          this.newCode=""
          this.newName=""
        },
        error: (err) => {
          alert(
"Error "+ err.status+":" + err.message          );
          this.charge()
        }
      })
    );

  }

  deleteLine(id:number){
    this.subs.add(
      this.service.dellLines(id).subscribe({
        next: (value) => {
          alert(
            'Eliminada'
          );
          this.charge()
        },
        error: (err) => {
          alert(
"Error "+ err.status+":" + err.message          );
          this.charge()
        }
      })
    );
  }
}
