import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event as EventModel } from '../models/event';

@Injectable({ providedIn: 'root' })

export class EventsService {
  private apiUrl = 'http://localhost:8081/GestionEvents';  

  constructor(private http: HttpClient) {}
 
  // getAllEvents(): Observable<EventModel[]> {   
  //   return this.http.get<EventModel[]>(this.apiUrl)
  //     .pipe(catchError(this.handleError));
  // }

  //Get all events
  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.apiUrl}/getAllEvents`);
  }

  //Add a new event
  addEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(`${this.apiUrl}/addEvent`, event); }

  // Upload an image for an event
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/uploadEventImage`, formData)
   }

  // Delete an event by ID
  deleteEvent(idEvent: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEvent/${idEvent}`, {responseType:'test'as'json'});
  }

  // Get an event by ID
  getEventById(idEvent: number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/getEventById/${idEvent}`);
  }

  // Update an existing event
  updateEvent(event: EventModel): Observable<EventModel> {
    return this.http.put<EventModel>(`${this.apiUrl}/updateEvent`, event);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}