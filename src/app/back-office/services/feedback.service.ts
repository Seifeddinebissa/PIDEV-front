import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/Feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = 'http://localhost:8081/api/feedbacks';

  constructor(private http: HttpClient) { }

  getAllFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFeedbackById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateFeedback(id: number, feedback: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/${id}`, feedback);
  }

  getFeedbacksForFormation(formationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  deleteFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addFeedback(feedback: any, formation_id: number, user_id: number): Observable<any> {
    const url = `${this.apiUrl}?formation_id=${formation_id}&user_id=${user_id}`;
    return this.http.post<any>(url, feedback);
  }

  // Added method to check if feedback exists for a user and formation
  checkFeedbackExists(userId: number, formationId: number): Observable<any> {
    const url = `${this.apiUrl}/check?userId=${userId}&formationId=${formationId}`;
    return this.http.get<any>(url);
  }

  getAllFormationsFeedbackStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats`);
  }

  exportStatsToPDF(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/stats/export/pdf`, { responseType: 'blob' });
  }

  getTopRatedFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-rated`);
  }
}