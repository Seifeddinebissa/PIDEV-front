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

  // Ajouter une question à un quiz
  addQuestionToQuiz(quizId: number, question: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/quiz/${quizId}`, question);
  }

  // Mettre à jour une question
  updateQuestion(id: number, question: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, question);
  }

  // Supprimer une question
  deleteQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}