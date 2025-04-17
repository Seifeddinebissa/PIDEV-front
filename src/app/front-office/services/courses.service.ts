import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:8088/dorra/cours';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  getCoursById(idCours: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${idCours}`);
  }
  

  generateMeetLink(courseName: string, scheduledAt: string, password: string): Observable<any> {
    const request = { courseName, scheduledAt, password };
    return this.http.post<any>(`${this.apiUrl}/generate-meet`, request);
  }

  getAllMeetingLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/meeting-links`);
  }

  getMeetingLinkById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/meeting-links/${id}`);
  }

  getUpcomingMeetingLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/meeting-links/upcoming`);
  }

  deactivateMeetingLink(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/meeting-links/${id}/deactivate`, {});
  }

  deleteMeetingLink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meeting-links/${id}`);
  }

  updateMeetingLink(id: number, courseName: string, scheduledAt: string, password: string, active: boolean): Observable<any> {
    const request = { courseName, scheduledAt, password, active };
    return this.http.put<any>(`${this.apiUrl}/meeting-links/${id}`, request);
  }





    


    
  
}
