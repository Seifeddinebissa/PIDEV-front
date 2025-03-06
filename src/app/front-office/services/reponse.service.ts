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
  

  
    // Récupérer toutes les réponses
    getAllReponses(): Observable<Reponse[]> {
      return this.http.get<Reponse[]>(`${this.apiUrl}/getAll`);
    }
  
    // Récupérer une réponse par ID
    getReponseById(id: number): Observable<Reponse> {
      return this.http.get<Reponse>(`${this.apiUrl}/${id}`);
    }
  
 
  
   // Récupérer les réponses d'une question
    getReponsesByQuestionId(questionId: number): Observable<Reponse[]> {
      return this.http.get<Reponse[]>(`${this.apiUrl}/question/${questionId}`);
    }
}
