import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private messageSubject = new Subject<any>();
  private readonly BROKER_URL = 'ws://localhost:8088/dorra/dorra/ws/websocket';

  constructor() {
    this.connect();
  }

  private connect(): void {
    console.log(`Tentative de connexion WebSocket à ${this.BROKER_URL}`);

    this.stompClient = new Stomp.Client({
      brokerURL: this.BROKER_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connecté avec succès');
        this.stompClient!.subscribe('/topic/meetings', (message: Stomp.Message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log('Message reçu:', parsedMessage);
            this.messageSubject.next(parsedMessage);
          } catch (e) {
            console.error('Erreur lors du parsing du message:', e);
          }
        });
      },
      onStompError: (error) => {
        console.error('Erreur de connexion STOMP:', error);
        this.messageSubject.error(error);
      },
      onWebSocketError: (error) => {
        console.error('Erreur WebSocket:', error);
        this.messageSubject.error(error);
      }
    });

    this.stompClient.activate();
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate().then(() => {
        console.log('WebSocket déconnecté');
      });
    }
  }
}