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

  addQuizToCourse(idCours: number, quiz: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add/${idCours}`, quiz);
  }

  updateQuiz(idQuiz: number, quiz: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${idQuiz}`, quiz);
  }

  deleteQuiz(idQuiz: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${idQuiz}`);
  }

  getAllQuizScores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.scoreApiUrl}/all`);
  }

  deleteScoreQuiz(idScoreQuiz: number): Observable<any> {
    return this.http.delete<any>(`${this.scoreApiUrl}/${idScoreQuiz}`);
  }

  getDistinctQuizNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.scoreApiUrl}/quizNames`);
  }
}
