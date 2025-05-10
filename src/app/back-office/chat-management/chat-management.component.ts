import { Component } from '@angular/core';

import { ChatService } from '../services/chat.service';
import { Chat } from '../../back-office/models/Chat'; 
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-chat-management',
  templateUrl: './chat-management.component.html',
  styleUrls: ['./chat-management.component.css']
})
export class ChatManagementComponent implements OnInit {
  chats: Chat[] = [];
  error: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadChats();
  }

  // Charger toutes les conversations
  loadChats(): void {
    this.chatService.getAllChats().subscribe({
      next: (chats) => {
        this.chats = chats;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des conversations : ' + (err.error || err.message);
      }
    });
  }

  // Supprimer une conversation
  deleteChat(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      this.chatService.deleteChat(id).subscribe({
        next: () => {
          this.chats = this.chats.filter(chat => chat.id !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la conversation : ' + (err.error || err.message);
        }
      });
    }
  }
}