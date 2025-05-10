import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Chat} from  '../models/Chat';
// Interface pour représenter un objet Chat (doit être définie avant son utilisation)

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = "http://localhost:8099/chat"; // URL correcte pour le chat

  constructor(private http: HttpClient) {}

  // Méthode transférée depuis ReclamationService
  generateResponse(prompt: string, userId: number = 1): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { prompt, userId };
    return this.http.post(`${this.apiUrl}/generate`, body, { headers, responseType: 'text' });
  }


// Lister tous les chats (GET /chat/all)
getAllChats(): Observable<Chat[]> {
  return this.http.get<Chat[]>(`${this.apiUrl}/all`);
}

// Récupérer un chat par ID (GET /chat/{id})
getChatById(id: number): Observable<Chat> {
  return this.http.get<Chat>(`${this.apiUrl}/${id}`);
}

// Lister l'historique des chats d'un utilisateur (GET /chat/history/{userId})
getChatsByUserId(userId: number): Observable<Chat[]> {
  return this.http.get<Chat[]>(`${this.apiUrl}/history/${userId}`);
}

// Supprimer un chat par ID (DELETE /chat/{id})
deleteChat(id: number): Observable<string> {
  return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
}

// Supprimer tous les chats d'un utilisateur (DELETE /chat/historyy/{userId})
deleteChatsByUserId(userId: number): Observable<string> {
  return this.http.delete(`${this.apiUrl}/historyy/${userId}`, { responseType: 'text' });
}
}

