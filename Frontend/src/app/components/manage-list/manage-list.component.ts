import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TicketList } from '../../models/ticket-list';
import { TicketsService } from '../../services/tickets.service';
import { Ticket } from '../../models/ticket';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { WebSocketService } from '../../services/web-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-list',
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './manage-list.component.html',
  styleUrl: './manage-list.component.css',
})
export class ManageListComponent implements OnInit, OnDestroy {
  subs: Subscription = new Subscription();
  loading = false;
  loadingForButton = false;
  hasSelections = false;
  audioPaused = false;

  calledTicket: Ticket | undefined;
  lastSelectedTicket: Ticket | undefined;
  list: Ticket[] = [
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"CO","CO"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"P","Pediatria"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"C","Clinica"),
  ];
  lines: string[] = [
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"CO","CO"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"P","Pediatria"),
    // new TicketList([new Ticket(),new Ticket(),new Ticket()],"C","Clinica"),
  ];
  audio = new Audio('music.mp3');

  timeout: any;
  soundTimer = environment.soundTimeout;

  admin = false;

  callerId:string=""

  constructor(
    private service: TicketsService,
    private authService: AuthService,
    private webSocket: WebSocketService
  ) {}
  ngOnInit(): void {
    this.audio.loop = true;
    this.charge();
    this.admin = this.authService.user?.admin || false;
    this.generateCallerId();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  charge() {
    this.loading = true;
    this.subs.add(
      this.service.getLines().subscribe({
        next: (value) => {
          this.lines = value['data'].map((l: TicketList) => {
            return l.code;
          });
          console.log(value);
          this.getData();
          this.startWS();
        },
        error: (err) => {
          console.error(err);
          this.repeatOnFAil(this.charge);
        },
        complete: () => {
          this.loading = false;
        },
      })
    );
  }

  getData() {
    this.subs.add(
      this.service.getAll().subscribe({
        next: (value) => {
          this.saveData(value['data']);
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.loading = false;
        },
      })
    );
  }

  startWS() {
    this.subs.add(
      this.webSocket.getMessages().subscribe({
        next: (value) => {
          const message = value['message'];

          if (message['type'] == 'update') {
            this.saveData(message['data']);
          } else if (message['type'] == 'call') {
            this._callticket(message);
          } else if (message['type'] == 'error') {
            const error = confirm(
              `Error: ${message['code']} - ${message['message']}`
            );
            if (error && message['code'] == 401) {
              this.logout();
            }
          }
        },
        error: (err) => {
          this.repeatOnFAil(this.startWS);
        },
        complete: () => {
          this.loading = false;
        },
      })
    );
  }

  repeatOnFAil(repeatMethod: () => void){
    alert("Error, reintentando");
    this.timeout = setTimeout(() => {
      repeatMethod();
    }, 5000);
  }

  generateCallerId() {
    const callerId = sessionStorage.getItem('callerId') || ""
    if (!callerId) {
      sessionStorage.setItem(
        'callerId',
        Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)
      );
    }
    this.callerId = callerId;
  }

  logout() {
    this.authService.logout().subscribe({
      next: (v) => {
        this.authService.deleteData();
      },
    });
  }

  selectTicket(event: PointerEvent | MouseEvent, ticket: Ticket) {
    if (event.shiftKey) {
      const firstItem = this.lastSelectedTicket;
      if (firstItem) {
        const firstIndex = this.list.indexOf(firstItem);
        const secondIndex = this.list.indexOf(ticket);
        const startIndex = Math.min(firstIndex, secondIndex);
        const endIndex = Math.max(firstIndex, secondIndex);
        this.list.slice(startIndex, endIndex + 1).forEach((v) => {
          v.selected = true;
        });
      } else {
        ticket.selected = true;
      }
    } else {
      ticket.selected = !ticket.selected;
    }

    this.lastSelectedTicket = ticket;
    this.hasSelections = !!this.list.find((t) => {
      return t.selected;
    });
  }
  cancelSelected() {
    this.list.forEach((v) => {
      v.selected = false;
    });
    this.lastSelectedTicket = this.list[0];
    this.hasSelections = false;
  }

  deleteSelected() {
    if (!this.admin) return;
    let message = {
      type: 'dellist',
      tickets: this.list
        .filter((t) => {
          return t.selected;
        })
        .map((t) => {
          return { id: t.id };
        }),
    };
    this.hasSelections = false;
    this.lastSelectedTicket = undefined;

    this.webSocket.sendMessage({ message: message });
  }
  callTicket() {
    if (!this.calledTicket) {
      const ticketToCall = this.list[0];
      this.calledTicket = new Ticket(
        ticketToCall.code,
        ticketToCall.number,
        ticketToCall.user
      );
      this.calledTicket.id = ticketToCall.id;
    }

    let message = {
      type: 'call',
      id: this.calledTicket.id,
      number: this.calledTicket.number,
      code: this.calledTicket.code,
      user: this.authService.user?.username,
      callerId:this.callerId
    };

    this.webSocket.sendMessage({ message: message });
  }

  callNext() {
    this.calledTicket = undefined;
  }

  _callticket(data: any) {
    this.startLoading();
    if (data['callerId'] != this.callerId) {
      return;
    }
    this.calledTicket = new Ticket(data['code'], data['number'], data['user']);
    this.calledTicket.id = data['id'];
    this.playSound();

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.stopSound();
    }, this.soundTimer * 1000);
  }

  deleteTicket(id: number) {
    if (!this.admin) return;
    let message = {
      type: 'del',
      id: id,
    };

    this.webSocket.sendMessage({ message: message });
  }

  playSound() {
    try {
      this.audio.play();
      this.audioPaused = false;
    } catch {
      console.error('Error de audio');
    }
  }
  stopSound() {
    try {
      this.audio.pause();
      this.audioPaused = true;
    } catch {
      console.error('Error de audio');
    }
  }

  startLoading() {
    this.loadingForButton = true;
    setTimeout(() => {
      this.loadingForButton = false;
    }, 1000);
  }

  unsetSelected() {
    this.calledTicket = undefined;
    this.stopSound();
  }

  saveData(data: any) {
    let giveList: Ticket[] = data;
    let newList: Ticket[] = [];
    giveList.forEach((ticket) => {
      let findTicket = this.list.find((e) => {
        return e.id == ticket.id;
      });
      if (findTicket) {
        ticket.selected = findTicket.selected;
      }
      if (
        this.lines.find((l) => l == ticket.code) &&
        (!ticket.user || ticket.user == this.authService.user?.username)
      ) {
        newList.push(ticket);
      }
    });
    this.list = newList.sort((a, b) => {
      if (a.withTurn && b.withTurn) return 0;
      if (a.withTurn) return -1;
      if (b.withTurn) return 1;
      return 0;
    });
  }
}
