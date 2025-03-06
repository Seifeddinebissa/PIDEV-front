import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reponse {
  idReponse?: number;
  contenu: string;
  isCorrect: boolean;
  answernum: string; // "A", "B", "C", ou "D"
  questionId?: number; // Ajouté pour référence
}

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private apiUrl = 'http://localhost:8088/dorra/reponses';

  constructor(private http: HttpClient) { }

  // Ajouter une réponse à une question
  addReponseToQuestion(questionId: number, reponse: Reponse): Observable<Reponse> {
    return this.http.post<Reponse>(`${this.apiUrl}/question/${questionId}`, reponse);
  }

  // Récupérer toutes les réponses
  getAllReponses(): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/getAll`);
  }

  // Récupérer une réponse par ID
  getReponseById(id: number): Observable<Reponse> {
    return this.http.get<Reponse>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une réponse
  updateReponse(id: number, reponse: Reponse): Observable<Reponse> {
    return this.http.put<Reponse>(`${this.apiUrl}/${id}`, reponse);
  }

  // Supprimer une réponse
  deleteReponse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les réponses d'une question
  getReponsesByQuestionId(questionId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/question/${questionId}`);
  }
}