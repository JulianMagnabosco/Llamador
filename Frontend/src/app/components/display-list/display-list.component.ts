import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription,timer } from 'rxjs';
import { TicketsService } from '../../services/tickets.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { PatientCall } from '../../models/patient-call';
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

  list: PatientCall[] = [
    // new TicketList([new PatientCall(),new PatientCall(),new PatientCall()],"CO","CO"),
    // new TicketList([new PatientCall(),new PatientCall(),new PatientCall()],"P","Pediatria"),
    // new TicketList([new PatientCall(),new PatientCall(),new PatientCall()],"C","Clinica"),
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

    let newSize = this.list.unshift(new PatientCall(data['patient'],data['user']))
    if(newSize>10){
      this.list.pop()
    }
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

}
