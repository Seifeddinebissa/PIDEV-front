import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Notification } from '../models/Notification';
import { environnements } from 'src/environnements/environnements';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environnements.apiUrl + '/notifications';

  constructor(private http: HttpClient) { }

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(catchError(this.handleError));}

    getNotificationById(idNotification: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${idNotification}`).pipe(catchError(this.handleError) );
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification).pipe(catchError(this.handleError)); }

    createEventNotification(eventName: string, eventAction: string): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/event`, { eventName, eventAction }).pipe(
      catchError(this.handleError));}

  updateNotification(idNotification: number, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${idNotification}`, notification).pipe(
      catchError(this.handleError)
    );
  }

  deleteNotification(idNotification: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idNotification}`).pipe(catchError(this.handleError) ); }

  findNotificationsByUserId(idUser: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${idUser}`).pipe(catchError(this.handleError) );  }

  findNotificationsByStatus(status: boolean): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/status?status=${status}`).pipe( catchError(this.handleError)
    );
  }

  findNotificationsByDate(date: Date): Observable<Notification[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<Notification[]>(`${this.apiUrl}/date?date=${formattedDate}`).pipe(catchError(this.handleError));
  }

  findNotificationsByUserAndStatus(idUser: number, status: boolean): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${idUser}/status?status=${status}`).pipe(
      catchError(this.handleError)); }

  getUnreadNotifications(): Observable<Notification[]> {  return this.findNotificationsByStatus(false);  }

  markAsRead(idNotification: number): Observable<Notification> {
    const notification: Partial<Notification> = {  status: true };
    return this.updateNotification(idNotification, notification as Notification); }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {}).pipe(catchError(this.handleError) ); }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
} 