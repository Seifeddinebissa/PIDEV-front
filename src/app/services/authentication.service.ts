import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
 

  private apiUrl = 'http://localhost:8080/api/auth';
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  register(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  add(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/register`, formData,{ headers });
  }

  getProfile(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers });
  }

  getProfileImage(): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile/image`, { headers, responseType: 'blob' });
  }
    getAllUsers(): Observable<User[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<User[]>(`${this.apiUrl}/all`, { headers });
    }
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

   update(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, formData);
  }
  updatePassword(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-password`, formData);
  }
  block(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/block`, formData);
  }
  unblock(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/unblock`, formData);
  }
  existusername(username: string): Observable<any> {
    const params = new HttpParams().set('username', username);
    return this.http.get<User>(`${this.apiUrl}/exist-username`, {params});
  }
  existemail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    console.log(params);
    return this.http.get<User>(`${this.apiUrl}/exist-email`, {params});
  }
  forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/forgot-password`, null, { params });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('newPassword', newPassword);
    return this.http.post(`${this.apiUrl}/reset-password`, null, { params, observe: 'body',responseType: 'text' });
  }
}
