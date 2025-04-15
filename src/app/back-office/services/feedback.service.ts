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

  // Récupérer tous les feedbacks
  getAllFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFeedbackById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateFeedback(id: number, formation: Feedback): Observable<Feedback> {
            return this.http.put<Feedback>(`${this.apiUrl}/${id}`, formation);
  }

   // Méthode pour obtenir les feedbacks d'une formation
   getFeedbacksForFormation(formationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  // Supprimer un feedback par ID
  deleteFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addFeedback(feedback: any, formation_id: number): Observable<any> {
    const url = `${this.apiUrl}?formation_id=${formation_id}`; // Ajout du paramètre formation_id
    return this.http.post<any>(url, feedback);
  }

  getAllFormationsFeedbackStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats`);
  }

  // src/app/back-office/services/feedback.service.ts
  exportStatsToPDF(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/stats/export/pdf`, { responseType: 'blob' });
  }

  getTopRatedFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-rated`);
  }

}