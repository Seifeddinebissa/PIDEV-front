import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {


  private apiUrl = 'http://localhost:8088/dorra/questions';
  
    constructor(private http: HttpClient) { }
  
    // Récupérer toutes les questions
    getAllQuestions(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/getAllQuestions`);
    }
  
    // Récupérer une question par ID
    getQuestionById(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
  
    // Récupérer les questions d'un quiz
    getQuestionsByQuizId(quizId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/quiz/${quizId}`);
    }
  
}
