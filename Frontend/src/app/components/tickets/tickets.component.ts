import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket';
import { TicketsService } from '../../services/tickets.service';
import { Subscription } from 'rxjs';
import { DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  imports: [NgFor,DatePipe,FormsModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit, OnDestroy {

  list: Ticket[] = []

  subs:Subscription = new Subscription();

  page=1;
  size=25;

  order='date'
  dir='desc';

  previous=false;
  next=false;
  num_pages=0;
  total=0;

  constructor(private service:TicketsService) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
  ngOnInit(): void {
    this.search();

  }

  onSearchChange(){
    this.page=1;
    this.search();
  }

  search(){
    const paramList = {
      page: this.page,
      size: this.size,
      order: this.order,
      dir: this.dir
    }
    this.subs.add(
      this.service.searchTickets(paramList).subscribe({
        next:(value)=>{
          this.list=[];
          this.list=value.data;
          this.previous=value.previous;
          this.next=value.next;
          this.num_pages=value.num_pages;
          this.total=value.total;
        }
      })
    )
  }

  nextPage() {
    this.page++;
    this.search();
  }
  previousPage() {
    this.page--;
    this.search();
  }

}
