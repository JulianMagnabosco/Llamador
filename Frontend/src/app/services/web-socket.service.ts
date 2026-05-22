import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private baseUrl = 'ws://'+environment.apiUrl+"ws/chat/lobby/";
  private socket$: WebSocketSubject<any>;

 constructor() {
    this.socket$ = webSocket(this.baseUrl);
  }

  // Send a message to the server
  sendMessage(message: any) {
    this.socket$.next(message);
  }

  // Receive messages from the server
  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Close the WebSocket connection
  closeConnection() {
    this.socket$.complete();
  }
}