import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Event as EventModel } from '../models/event';
import { AuthService } from './auth.service'; 

// Interface pour typer la réponse de l'upload
// interface UploadResponse {
//   imageUrl: string;
// }

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly baseUrl = 'http://localhost:8081/GestionEvents';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(includeAuth = false): HttpHeaders {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.authService.getToken();
    return includeAuth && token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }

  private handleError(error: any): Observable<never> {
    console.error('Event Service Error:', error);
    const errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
    return throwError(() => new Error(errorMessage));
  }

  // Public endpoints
  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.baseUrl}/getAllEvents`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getEventById(idEvent: number): Observable<EventModel> {
    if (!idEvent) {
      return throwError(() => new Error('Event ID is required'));
    }
    return this.http.get<EventModel>(`${this.baseUrl}/getEventById/${idEvent}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  findEventsByName(eventName: string): Observable<EventModel[]> {
    if (!eventName?.trim()) {
      return throwError(() => new Error('Event name is required'));
    }
    return this.http.get<EventModel[]>(`${this.baseUrl}/search/name/${encodeURIComponent(eventName)}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  findEventsByLocation(location: string): Observable<EventModel[]> {
    if (!location?.trim()) {
      return throwError(() => new Error('Location is required'));
    }
    return this.http.get<EventModel[]>(`${this.baseUrl}/search/location/${encodeURIComponent(location)}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Protected endpoints
  addEvent(event: EventModel): Observable<EventModel> {
    if (!event) {
      return throwError(() => new Error('Event data is required'));
    }
    return this.http.post<EventModel>(`${this.baseUrl}/addEvent`, event, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }

    // Upload an image for an event
  uploadImage(imageUrl: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('imageUrl', imageUrl);
    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/uploadEventImage`, formData)
   }

  // uploadImage(idEvent: number, file: File): Observable<{ progress: number; url?: string }> {
  // if (!idEvent || !file) {
  //   return throwError(() => new Error('Invalid event ID or file'));
  // }

//   const formData = new FormData();
//   formData.append('idEvent', idEvent.toString());
//   formData.append('imageUrl', file);  

//   return this.http.post(`${this.baseUrl}/uploadEventImage`, formData, {
//     headers: this.getHeaders(true).delete('Content-Type'),
//     reportProgress: true,
//     observe: 'events'
//   }).pipe(
//     map(event => {
//       switch (event.type) {
//         case HttpEventType.UploadProgress:
//           if (!event.total) {
//             console.warn('event.total is undefined, progress set to 0');
//             return { progress: 0 };
//           }
//           const progress = Math.round(100 * event.loaded / event.total);
//           return { progress };
//         case HttpEventType.Response:
//           const response = event as HttpResponse<UploadResponse>;
//           if (response.body && response.body.imageUrl) {
//             return { progress: 100, url: response.body.imageUrl };
//           }
//           throw new Error('No image URL returned from server');
//         default:
//           return { progress: 0 };
//       }
//     }),
//     catchError(error => {
//       let errorMessage = 'Failed to upload image. Please try again.';
//       if (error.status === 401) {
//         this.authService.logout();
//         errorMessage = 'Unauthorized: Please log in again.';
//       } else if (error.status === 413) {
//         errorMessage = 'File too large. Please upload a smaller image.';
//       }
//       console.error('Upload failed:', error);
//       return throwError(() => new Error(errorMessage));
//     })
//   );
// }


  // uploadImage(idEvent: number, file: File): Observable<{ progress: number; url?: string }> {
  //   if (!idEvent || !file) {
  //     return throwError(() => new Error('Invalid event ID or file'));
  //   }

  //   const formData = new FormData();
  //   formData.append('idEvent', idEvent.toString());
  //   formData.append('image', file); // Changez en 'imageUrl' si le backend attend ce nom

  //   return this.http.post(`${this.baseUrl}/uploadEventImage`, formData, {
  //     headers: this.getHeaders(true).delete('Content-Type'), // Supprime Content-Type pour FormData
  //     reportProgress: true,
  //     observe: 'events'
  //   }).pipe(
  //     map(event => {
  //       switch (event.type) {
  //         case HttpEventType.UploadProgress:
  //           if (!event.total) {
  //             console.warn('event.total is undefined, progress set to 0');
  //             return { progress: 0 };
  //           }
  //           const progress = Math.round(100 * event.loaded / event.total);
  //           return { progress };
  //         case HttpEventType.Response:
  //           const response = event as HttpResponse<UploadResponse>;
  //           if (response.body && response.body.imageUrl) {
  //             return { progress: 100, url: response.body.imageUrl };
  //           }
  //           throw new Error('No image URL returned from server');
  //         default:
  //           return { progress: 0 };
  //       }
  //     }),
  //     catchError(error => {
  //       let errorMessage = 'Failed to upload image. Please try again.';
  //       if (error.status === 401) {
  //         this.authService.logout(); // Déconnexion si non autorisé
  //         errorMessage = 'Unauthorized: Please log in again.';
  //       } else if (error.status === 413) {
  //         errorMessage = 'File too large. Please upload a smaller image.';
  //       }
  //       console.error('Upload failed:', error);
  //       return throwError(() => new Error(errorMessage));
  //     })
  //   );
  // }

  deleteEvent(idEvent: number): Observable<string> {
    if (!idEvent) {
      return throwError(() => new Error('Event ID is required'));
    }
    return this.http.delete(`${this.baseUrl}/deleteEvent/${idEvent}`, {
      headers: this.getHeaders(true),
      responseType: 'text'
    }).pipe(
      map(response => response || 'Event deleted successfully'),
      catchError(this.handleError)
    );
  }

  updateEvent(idEvent: number, event: EventModel): Observable<EventModel> {
    if (!idEvent || !event) {
      return throwError(() => new Error('Event ID and data are required'));
    }
    return this.http.put<EventModel>(`${this.baseUrl}/updateEvent/${idEvent}`, event, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }

  // Date validation methods
  validateEventDates(startDate: Date | string, endDate: Date | string): { isValid: boolean; message: string } {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    now.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime())) {
      return { isValid: false, message: 'Start date is invalid' };
    }
    if (isNaN(end.getTime())) {
      return { isValid: false, message: 'End date is invalid' };
    }

    if (start < now) {
      return { isValid: false, message: 'Start date cannot be in the past' };
    }

    if (end < start) {
      return { isValid: false, message: 'End date must be after start date' };
    }

    const durationInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    if (durationInDays > 30) {
      return { isValid: false, message: 'Event duration cannot exceed 30 days' };
    }

    return { isValid: true, message: 'Dates are valid' };
  }

  createEvent(event: EventModel): Observable<EventModel> {
    if (!event) {
      return throwError(() => new Error('Event data is required'));
    }
    const dateValidation = this.validateEventDates(event.start_Date, event.end_Date);
    if (!dateValidation.isValid) {
      return throwError(() => new Error(dateValidation.message));
    }

    return this.http.post<EventModel>(`${this.baseUrl}/addEvent`, event, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }

  updateEventWithValidation(event: EventModel): Observable<EventModel> {
    if (!event || !event.idEvent) {
      return throwError(() => new Error('Event data and ID are required'));
    }
    const dateValidation = this.validateEventDates(event.start_Date, event.end_Date);
    if (!dateValidation.isValid) {
      return throwError(() => new Error(dateValidation.message));
    }

    return this.http.put<EventModel>(`${this.baseUrl}/updateEvent/${event.idEvent}`, event, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }
}