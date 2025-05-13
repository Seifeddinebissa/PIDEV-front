import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:8084/gestion_user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Convert dateOfBirth to Date
        if (userData.dateOfBirth) {
          userData.dateOfBirth = new Date(userData.dateOfBirth);
        }
        this.currentUserSubject.next(userData as User);
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        this.logout();
      }
    }
  }

  // Méthode pour initialiser l'authentification (appelée manuellement, par exemple dans AppComponent)
  initAuth(): void {
    if (this.getToken()) {
      this.getProfile().pipe(take(1)).subscribe({
        error: (err) => console.error('Failed to initialize auth:', err)
      });
    }
  }

  private getHeaders(includeAuth = false): HttpHeaders {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.getToken();
    return includeAuth && token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth Service Error:', error);
    let errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
    if (error.status === 401) {
      this.logout();
      errorMessage = 'Unauthorized: Please log in again.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request data. Please check your input.';
    }
    return throwError(() => new Error(errorMessage));
  }

  // Public endpoints
  login(credentials: { email: string; password: string }): Observable<{ token: string; user: User }> {
    if (!credentials?.email || !credentials?.password) {
      return throwError(() => new Error('Email and password are required'));
    }
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/signin`, credentials, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          // Convert dateOfBirth to Date
          if (response.user.dateOfBirth) {
            response.user.dateOfBirth = new Date(response.user.dateOfBirth);
          }
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  register(user: User): Observable<User> {
    if (!user?.email || !user?.pwd) {
      return throwError(() => new Error('Email and password are required'));
    }
    // Ensure dateOfBirth is a string for JSON serialization
    const payload = { ...user, dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null };
    return this.http.post<User>(`${this.baseUrl}/signup`, payload, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          // Convert dateOfBirth to Date
          if (response.dateOfBirth) {
            response.dateOfBirth = new Date(response.dateOfBirth);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Protected endpoints
  getProfile(): Observable<User> {
    if (!this.getToken()) {
      return throwError(() => new Error('No token available'));
    }
    return this.http.get<User>(`${this.baseUrl}/me`, { headers: this.getHeaders(true) })
      .pipe(
        tap(user => {
          // Convert dateOfBirth to Date
          if (user.dateOfBirth) {
            user.dateOfBirth = new Date(user.dateOfBirth);
          }
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getProfileImage(): Observable<Blob> {
    if (!this.getToken()) {
      return throwError(() => new Error('No token available'));
    }
    return this.http.get(`${this.baseUrl}/profile/image`, {
      headers: this.getHeaders(true),
      responseType: 'blob'
    }).pipe(catchError(this.handleError.bind(this)));
  }

  uploadProfileImage(file: File): Observable<void> {
    if (!file) {
      return throwError(() => new Error('Image file is required'));
    }
    if (!this.getToken()) {
      return throwError(() => new Error('No token available'));
    }
    const formData = new FormData();
    formData.append('photo', file); // Changé de 'image' à 'photo' pour correspondre au champ 'photo' dans User
    return this.http.post<void>(`${this.baseUrl}/profile/image`, formData, {
      headers: this.getHeaders(true).delete('Content-Type')
    }).pipe(catchError(this.handleError.bind(this)));
  }

  updateProfile(user: User): Observable<User> {
    if (!user) {
      return throwError(() => new Error('User data is required'));
    }
    if (!this.getToken()) {
      return throwError(() => new Error('No token available'));
    }
    // Ensure dateOfBirth is a string for JSON serialization
    const payload = { ...user, dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null };
    return this.http.put<User>(`${this.baseUrl}/profile`, payload, { headers: this.getHeaders(true) })
      .pipe(
        tap(updatedUser => {
          // Convert dateOfBirth to Date
          if (updatedUser.dateOfBirth) {
            updatedUser.dateOfBirth = new Date(updatedUser.dateOfBirth);
          }
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<void> {
    if (!data?.currentPassword || !data?.newPassword) {
      return throwError(() => new Error('Current and new passwords are required'));
    }
    if (!this.getToken()) {
      return throwError(() => new Error('No token available'));
    }
    return this.http.put<void>(`${this.baseUrl}/change-password`, data, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Local storage management
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }
}