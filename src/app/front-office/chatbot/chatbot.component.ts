import { Component } from '@angular/core';
import { ReclamationService } from '../../back-office/services/reclamation.service';
import { ChatService } from '../../back-office/services/chat.service'
import { Chat } from '../../back-office/models/Chat'; // Importer Chat depuis models
import { OnInit } from '@angular/core';

interface Message {
  prompt: string;
  response?: string;
  timestamp: Date; // Ajout du timestamp pour les messages actuels
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  prompt: string = '';
  response: string = '';
  loading: boolean = false;
  error: string = '';
  userId: number = 1; // ID de l'utilisateur (peut être dynamique)
  chatHistory: Chat[] = []; // Liste pour stocker l'historique des chats
  showHistory: boolean = false; // Contrôle l'affichage de l'historique
  currentMessages: Message[] = []; // Liste pour stocker les messages de la session actuelle

  constructor(private service: ChatService) {}

  ngOnInit(): void {
    // Charger l'historique des chats au démarrage, mais ne pas l'afficher
    this.loadChatHistory();
  }

  // Charger l'historique des chats
  loadChatHistory(): void {
    this.service.getChatsByUserId(this.userId).subscribe({
      next: (chats) => {
        this.chatHistory = chats;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'historique : ' + (err.error || err.message);
        // Si aucun chat n'est trouvé, vider l'historique local
        if (err.status === 404 || err.error?.includes('Aucun chat trouvé')) {
          this.chatHistory = [];
        }
      }
    });
  }

  // Envoyer un message
  sendMessage(): void {
    if (!this.prompt.trim()) {
      this.error = 'Veuillez entrer un message';
      return;
    }

    // Ajouter le prompt à la liste des messages actuels avec un timestamp
    const currentTime = new Date();
    this.currentMessages.push({ prompt: this.prompt, timestamp: currentTime });
    this.loading = true;
    this.error = '';
    this.response = '';

    this.service.generateResponse(this.prompt, this.userId).subscribe({
      next: (res) => {
        this.response = res;
        // Ajouter la réponse au dernier message de la session actuelle
        this.currentMessages[this.currentMessages.length - 1].response = res;
        this.loading = false;
        // Recharger l'historique, mais ne pas l'afficher automatiquement
        this.loadChatHistory();
        this.prompt = ''; // Réinitialiser le champ de saisie
      },
      error: (err) => {
        this.error = 'Erreur : ' + (err.error || err.message);
        this.loading = false;
      }
    });
  }

  // Démarrer une nouvelle conversation
  startNewConversation(): void {
    // Appeler le backend pour supprimer tous les chats de l'utilisateur
    this.service.deleteChatsByUserId(this.userId).subscribe({
      next: () => {
        // Réinitialiser l'historique local
        this.chatHistory = [];
        // Réinitialiser la réponse actuelle
        this.response = '';
        this.error = '';
        this.prompt = '';
        // Réinitialiser les messages actuels
        this.currentMessages = [];
        // Masquer l'historique
        this.showHistory = false;
      },
      error: (err) => {
        // Si aucun chat n'est trouvé, ce n'est pas une erreur critique
        if (err.status === 404 || err.error?.includes('Aucun chat trouvé')) {
          // Réinitialiser l'interface localement
          this.chatHistory = [];
          this.response = '';
          this.error = '';
          this.prompt = '';
          this.currentMessages = [];
          this.showHistory = false;
        } else {
          // Afficher d'autres erreurs
          this.error = 'Erreur lors de la réinitialisation de la conversation : ' + (err.error || err.message);
        }
      }
    });
  }

  // Afficher ou masquer l'historique
  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    // Recharger l'historique si on l'affiche
    if (this.showHistory) {
      this.loadChatHistory();
    }
  }
}
/*
    // Passer userId (par exemple, 1) à generateResponse
    this.Service.generateResponse(this.prompt, 1)
      .subscribe({
        next: (res) => {
          this.response = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error: ' + (err.error || err.message);
          this.loading = false;
        }
      });
      */
  


  
