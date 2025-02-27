import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Formation } from '../models/Formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  apiUrl = "http://localhost:8081/api/formations";
  constructor(private http: HttpClient,
      private router: Router) { }

      getAllFormation():Observable<any[]>{
          return this.http.get<any[]>(this.apiUrl+"/get-all");  
        }

      getFormationById(id: number): Observable<Formation> {
          return this.http.get<Formation>(`${this.apiUrl}/${id}`);
        }
      
      updateFormation(id: number, formation: Formation): Observable<Formation> {
          return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
        }

        deleteFormation(id: number): Observable<void> {
          return this.http.delete<void>(`${this.apiUrl}/${id}`);
        }

        addFormation(formation: any): Observable<any> {
          return this.http.post<any>(this.apiUrl, formation);
        }

        getFeedbackCountByFormation(id: number): Observable<number> {
          return this.http.get<number>(`${this.apiUrl}/${id}/feedback-count`);
        }

        // New method to get feedbacks for a formation
  getFeedbacksByFormation(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/feedbacks`);
  }
}
