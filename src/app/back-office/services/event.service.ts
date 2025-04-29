import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
    return this.http.get<EventModel[]>(`${this.apiUrl}/getAllEvents`)
      .pipe(
        tap(events => console.log('Fetched events:', events)),
        // Transform event objects to fix image URLs
        map(events => events.map(event => this.processEventImageUrl(event))),
        catchError(this.handleError)
      );
  }

  //Add a new event
  addEvent(event: EventModel): Observable<EventModel> {
    try {
      // Create a copy of the event with properly formatted date strings
      const eventToSend = {
        ...event,
        start_Date: this.formatDateForBackend(event.start_Date),
        end_Date: this.formatDateForBackend(event.end_Date)
      };
      
      // Set the Content-Type to application/json
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      
      console.log('Sending event data:', eventToSend);
      
      // First convert to JSON string to ensure proper formatting, then send with the headers
      return this.http.post<EventModel>(`${this.apiUrl}/addEvent`, JSON.stringify(eventToSend), {headers})
        .pipe(
          tap(response => console.log('Event created:', response)),
          catchError(error => {
            console.error('Error creating event:', error);
            if (error.error && typeof error.error === 'string' && error.error.includes('Date')) {
              return throwError(() => new Error('Date format error: The server requires dates in format yyyy-MM-ddTHH:mm:ss'));
            }
            if (error.error && typeof error.error === 'string' && error.error.includes('id_event')) {
              return throwError(() => new Error('Database error: id_event field is required'));
            }
            return this.handleError(error);
          })
        );
    } catch (err) {
      console.error('Error preparing event data:', err);
      return throwError(() => new Error('Failed to prepare event data: ' + (err instanceof Error ? err.message : String(err))));
    }
  }

  // Upload an image for an event
  uploadImage(idEvent: number, file: File): Observable<any> {
    // Create a FormData object - this sets the correct Content-Type header automatically
    const formData = new FormData();
    
    // Add both required parameters: idEvent and image
    formData.append('idEvent', idEvent.toString());
    formData.append('image', file, file.name);
    
    console.log('Uploading image for event:', idEvent);
    console.log('File:', file.name, file.type, file.size);
    
    // Log the full request details
    console.log('FormData contents:', {
      eventId: idEvent,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      endpoint: `${this.apiUrl}/uploadEventImage`
    });
    
    // Send the multipart request without manually setting Content-Type
    return this.http.post(`${this.apiUrl}/uploadEventImage`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          console.log(`Upload progress: ${progress}%`);
          return { progress };
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload complete', event.body);
          return event.body;
        }
        return event;
      }),
      catchError(error => {
        console.error('Error uploading image:', error);
        return throwError(() => new Error(`Failed to upload image: ${error.message}`));
      })
    );
  }

  // Delete an event by ID
  deleteEvent(idEvent: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEvent/${idEvent}`, {
      responseType: 'text' as 'json'  // Handle server's text response
    }).pipe(
      tap(response => console.log('Delete response:', response)),
      map(() => undefined), // Convert to void
      catchError(error => {
        console.error('Error deleting event:', error);
        return this.handleError(error);
      })
    );
  }

  // Get an event by ID
  getEventById(idEvent: number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/getEventById/${idEvent}`)
      .pipe(
        tap(event => console.log('Fetched event by ID:', event)),
        map(event => {
          // Provide default values for null properties
          return {
            idEvent: event.idEvent || 0,
            eventName: event.eventName || 'Unnamed Event',
            location: event.location || 'Unknown Location',
            capacity: event.capacity || 0,
            start_Date: event.start_Date || new Date(),
            end_Date: event.end_Date || new Date(),
            imageUrl: event.imageUrl || ''
          } as EventModel;
        }),
        // Fix image URL in the single event object
        map(event => this.processEventImageUrl(event)),
        catchError(this.handleError)
      );
  }

  // Update an existing event
  updateEvent(currentEventId: number, event: EventModel): Observable<EventModel> {
    try {
      // Make sure the event has the correct ID and properly formatted dates
      const eventToUpdate = { 
        ...event, 
        idEvent: currentEventId,
        id_event: currentEventId, // Explicitly set id_event to match the backend database field name
        start_Date: this.formatDateForBackend(event.start_Date),
        end_Date: this.formatDateForBackend(event.end_Date)
      };
      
      // Create FormData object instead of using JSON
      const formData = new FormData();
      
      // Add all event properties to the FormData
      Object.entries(eventToUpdate).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      console.log('Updating event data:', eventToUpdate);
      
      return this.http.put<EventModel>(`${this.apiUrl}/updateEvent/${eventToUpdate.idEvent}`, formData)
        .pipe(
          tap(response => console.log('Event updated:', response)),
          catchError(error => {
            console.error('Error updating event:', error);
            if (error.error && typeof error.error === 'string' && error.error.includes('Date')) {
              return throwError(() => new Error('Date format error: The server requires dates in format yyyy-MM-ddTHH:mm:ss'));
            }
            if (error.error && typeof error.error === 'string' && error.error.includes('id_event')) {
              return throwError(() => new Error('Database error: id_event field is required'));
            }
            return this.handleError(error);
          })
        );
    } catch (err) {
      console.error('Error preparing event data for update:', err);
      return throwError(() => new Error('Failed to prepare event data: ' + (err instanceof Error ? err.message : String(err))));
    }
  }

  findEventsByName(name: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/search/name/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  findUpcomingEvents(date: Date): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/upcoming?date=${date.toISOString()}`).pipe(
      catchError(this.handleError)
    );
  }

  findPastEvents(date: Date): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/past?date=${date.toISOString()}`).pipe(
      catchError(this.handleError)
    );
  }

  findEventsByLocation(location: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/search/location/${location}`).pipe(
      catchError(this.handleError)
    );
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

  // Helper method to process event image URLs
  private processEventImageUrl(event: EventModel): EventModel {
    if (!event) return event;
    
    // Check if imageUrl is present but needs fixing
    if (event.imageUrl) {
      // If imageUrl doesn't start with http or data:, prepend the API base URL
      if (!event.imageUrl.startsWith('http') && !event.imageUrl.startsWith('data:')) {
        // Remove any leading slashes for consistency
        const cleanedPath = event.imageUrl.replace(/^\/+/, '');
        // Construct the full URL to the image
        event.imageUrl = `http://localhost:8081/${cleanedPath}`;
      }
      console.log('Processed image URL:', event.imageUrl);
    } else {
      console.log('No image URL for event:', event.idEvent);
    }
    
    return event;
  }

  // Helper method to format dates consistently for the backend
  private formatDateForBackend(date: Date | string): string {
    if (!date) return '';
    
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else {
      // If it's a string, try to parse it
      dateObj = new Date(date);
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    
    // Format as "yyyy-MM-dd'T'HH:mm:ss" as required by the backend
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}