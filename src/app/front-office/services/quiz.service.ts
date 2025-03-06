import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8088/dorra/Quiz';
  private scoreApiUrl = 'http://localhost:8088/dorra/scoreQuiz';

  constructor(private http: HttpClient) { }

  getQuizzesByCourse(idCours: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/byCourse/${idCours}`);
  }

  getAllQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  getQuizById(idQuiz: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idQuiz}`);
  }

  submitQuiz(quizId: number, userId: number, userAnswers: { [key: number]: string }, params: { isTimedOut: boolean } = { isTimedOut: false }): Observable<any> {
    const url = `${this.scoreApiUrl}/submit/${quizId}/${userId}?isTimedOut=${params.isTimedOut}`;
    return this.http.post<any>(url, userAnswers);
  }

  // Nouvelle méthode pour récupérer le score
  getScoreForUserAndQuiz(userId: number, quizId: number): Observable<any> {
    return this.http.get<any>(`${this.scoreApiUrl}/user/${userId}/quiz/${quizId}`);
  }
}