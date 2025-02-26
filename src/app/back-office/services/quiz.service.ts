import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'http://localhost:8088/dorra/Quiz';

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
}
