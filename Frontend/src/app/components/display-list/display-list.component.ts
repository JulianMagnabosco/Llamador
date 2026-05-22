import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription,timer } from 'rxjs';
import { TicketList } from '../../models/ticket-list';
import { TicketsService } from '../../services/tickets.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Ticket } from '../../models/ticket';
import { WebSocketService } from '../../services/web-socket.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-display-list',
  imports: [NgFor,DatePipe],
  templateUrl: './display-list.component.html',
  styleUrl: './display-list.component.css',
})
export class DisplayListComponent implements OnInit, OnDestroy {
  subs: Subscription = new Subscription();
  loading = false;

  fullscreen=false

  calledList:Ticket[]=[];
  list: Ticket[] = [
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"CO","CO"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"P","Pediatria"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"C","Clinica"),
  ];
  lines: string[]=[]
  notShowlines: string[]=[]
  audio = new Audio('music.mp3');
  audioPaused=true

  timeout: any;
  soundTimer = environment.soundTimeout;

  datetime=new Date();
  constructor(
    private service: TicketsService,
    private webSocket: WebSocketService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.audio.loop=true
    this.charge();
  }

  ngOnDestroy(): void {

    this.subs.unsubscribe();
  }
  charge() {
    this.subs.add(timer(0,1000).subscribe({
      next: (value)=>{
        this.datetime=new Date()
      }
    }))
    this.loading = true;
    this.subs.add(this.route.queryParams.subscribe({
      next:(value)=> {
        if(value["lines"]){
          this.lines= value["lines"].toUpperCase().split(",");
        }
        if(value["notlines"]){
          this.notShowlines= value["notlines"].toUpperCase().split(",");
        }
        // this.startHTTP()
      },
    }))
    this.startWS()

  }

  // startHTTP(){
    
  //   this.subs.add(
  //     this.service.getAll().subscribe({
  //       next: (value) => {
  //         // this.saveData(value['data']);
  //       },
  //       error: (err) => {
  //         console.error("Reintentando")
  //       },
  //       complete: () => {
  //         this.loading = false;
  //       },
  //     })
  //   );
  // }

  startWS(){
    
    this.subs.add(
      this.webSocket.getMessages().subscribe({
        next: (value) => {
          if (value['message']['type'] == 'update') {
            // this.saveData(value['message']['data']);
          } else if (value['message']['type'] == 'call') {
            this._callticket(value['message']);
            console.log("call")
          }
        },
        error: (err) => {
          console.error("Reintentando")
          this.charge()
        },
      })
    );
  }

  _callticket(data: any) {
    const inlist = (this.lines.length !=0 && !this.lines.includes(data['code']));

    const notinlist = (this.notShowlines.length !=0 && this.notShowlines.find((l)=> l==data['code'] ));

    if(inlist || notinlist){
      console.log("No se muestra la linea")
      return
    }
    
    this.calledList=this.calledList.filter((t)=>{
      const match = t.user!=data['user']
      if(match) return true
      
      this.list.unshift(new Ticket(t['code'],t['number'],t['user']))
      return false
    })

    this.list=this.list.filter((t)=>{
      return !(t.code==data['code'] && t.number==data['number'])
    })
    this.calledList.unshift(new Ticket(data['code'],data['number'],data['user']))
    this.playSound();
    
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.stopSound();
    }, this.soundTimer * 1000);
  }

  playSound(){
    try{
      this.audio.play();
      this.audioPaused=false
    }catch{
      console.error("Error de audio")
    }
  }
  stopSound(){
    try{
      this.audio.pause();
      this.audioPaused=true
    }catch{
      console.error("Error de audio")
    }
  }

  // saveData(data: any) {
  //   let givenList: Ticket[] = data;
  //   let newList: Ticket[] = [];
  //   givenList.forEach((ticket) => {
  //     let findTicket = this.list.find((e) => {
  //       return e.id == ticket.id;
  //     });
  //     if(findTicket){
  //       ticket.selected=findTicket.selected
  //     }
  //     const inlist =    (this.lines.length ==0        || this.lines.find((l)=> l==ticket.code ));
  //     const innotlist = (this.notShowlines.length ==0 || !this.notShowlines.find((l)=> l==ticket.code ));
      
  //     if(inlist && innotlist){
  //       newList.push(ticket)
  //     }
  //   });
  //   this.list=newList;
  // }
}
