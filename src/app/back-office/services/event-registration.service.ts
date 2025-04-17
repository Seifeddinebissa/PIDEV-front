import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventRegistration } from '../models/event-registration';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {
  private apiUrl = 'http://localhost:8081/api/registrations';

  constructor(private http: HttpClient) { }

  getAllRegistrations(): Observable<EventRegistration[]> {
    return this.http.get<EventRegistration[]>(this.apiUrl);
  }

  getRegistrationById(idRegistration: number): Observable<EventRegistration> {
    return this.http.get<EventRegistration>(`${this.apiUrl}/${idRegistration}`);
  }

  createRegistration(registration: EventRegistration): Observable<EventRegistration> {
    return this.http.post<EventRegistration>(this.apiUrl, registration);
  }

  updateRegistration(idRegistration: number, registration: EventRegistration): Observable<EventRegistration> {
    return this.http.put<EventRegistration>(`${this.apiUrl}/${idRegistration}`, registration);
  }

  deleteRegistration(idRegistration: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idRegistration}`);
  }

  findRegistrationsByEventId(idEvent: number): Observable<EventRegistration[]> {
    return this.http.get<EventRegistration[]>(`${this.apiUrl}/event/${idEvent}`);
  }

  findRegistrationsByUserId(idUser: number): Observable<EventRegistration[]> {
    return this.http.get<EventRegistration[]>(`${this.apiUrl}/user/${idUser}`);
  }

  findRegistrationsByDate(date: Date): Observable<EventRegistration[]> {
    return this.http.get<EventRegistration[]>(`${this.apiUrl}/date?date=${date.toISOString().split('T')[0]}`);
  }

  findRegistrationsByEventAndUser(idEvent: number, idUser: number): Observable<EventRegistration[]> {
    return this.http.get<EventRegistration[]>(`${this.apiUrl}/event/${idEvent}/user/${idUser}`);
  }
} 