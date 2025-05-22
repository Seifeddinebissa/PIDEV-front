import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Notification } from '../models/Notification';
import { environnements } from 'src/environnements/environnements';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseUrl = environnements.apiUrl + '/notifications';

  constructor(private http: HttpClient) { }

  private getHeaders(includeAuth = false): HttpHeaders {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return includeAuth ? headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`) : headers;
  }

  private handleError(error: any): Observable<never> {
    console.error('Notification Service Error:', error);
    return throwError(() => new Error(error.error?.message || error.message));
  }

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/getAllNotifications`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  getNotificationById(idNotification: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}/get/${idNotification}`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  addNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}/addNotification`, notification, { headers: this.getHeaders(true) }).pipe(catchError(this.handleError));
  }

  deleteNotification(idNotification: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${idNotification}`, { headers: this.getHeaders(true) }).pipe(catchError(this.handleError));
  }

  updateNotification(idNotification: number, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(`${this.baseUrl}/update/${idNotification}`, notification, { headers: this.getHeaders(true) }).pipe(catchError(this.handleError));
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl, notification).pipe(catchError(this.handleError));
  }

  createEventNotification(eventName: string, eventAction: string): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}/event`, { eventName, eventAction }).pipe(
      catchError(this.handleError));
  }

  findNotificationsByUserId(idUser: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${idUser}`).pipe(catchError(this.handleError));
  }

  findNotificationsByStatus(status: boolean): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/status?status=${status}`).pipe(catchError(this.handleError));
  }

  findNotificationsByDate(date: Date): Observable<Notification[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<Notification[]>(`${this.baseUrl}/date?date=${formattedDate}`).pipe(catchError(this.handleError));
  }

  findNotificationsByUserAndStatus(idUser: number, status: boolean): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${idUser}/status?status=${status}`).pipe(
      catchError(this.handleError));
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.findNotificationsByStatus(false);
  }

  markAsRead(idNotification: number): Observable<Notification> {
    const notification: Partial<Notification> = { status: true };
    return this.updateNotification(idNotification, notification as Notification);
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/mark-all-read`, {}).pipe(catchError(this.handleError));
  }
} 