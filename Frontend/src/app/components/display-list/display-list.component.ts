import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription,timer } from 'rxjs';
import { PatientCallsService } from '../../services/patientcalls.service';
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
  ];
  calledList: PatientCall[] = [
    new PatientCall("JUAN PEREZ","Caja 1"),
  ];
  
  audio = new Audio();
  processing = false;
  patientCall?: PatientCall;

  timeout: any;
  soundTimer = 500; 

  datetime=new Date();
  constructor(
    private service: PatientCallsService,
    private webSocket: WebSocketService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
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
    
    this.startProcessing();

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
            this.list.push(value['message']['data']);
          }
          console.log(value)
        },
        error: (err) => {
          console.error("Reintentando")
          this.charge()
        },
      })
    );
  }

  async startProcessing() {
    while (true) {
      if (!this.processing && this.list.length > 0) {
        this.patientCall = this.list.shift()!;
        this.calledList.push(this.patientCall);
        this.processing = true;
        await this.downloadAndPlayAudio(this.patientCall);
        this.processing = false;
      }
      await this.delay(500); // Espera medio segundo entre chequeos
    }
  }

  async downloadAndPlayAudio(data: PatientCall): Promise<void> {
    const text = `Llamando a ${data.patient} al consultorio ${data.user}`;
    let attempts = 3;
    return new Promise<void>((resolve) => {
      this.service.getTextToSpeech(text).subscribe({
        next: (blob) => {
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.onended = () => {
            attempts--;
            if (attempts == 0) {
              URL.revokeObjectURL(audioUrl); // liberar memoria
              resolve();
            }
            else {
              audio.play(); // Reproducir de nuevo
            }
          };
          audio.onerror = () => {
            console.error('Error al reproducir audio');
            resolve();
          };
          audio.play();
        },
        error: (err) => {
          console.error('Error al descargar audio:', err);
          resolve();
        },
      });
    });
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
