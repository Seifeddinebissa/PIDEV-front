import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';  // Import Observable
import { Application, Offre } from '../Models/offre.model';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  

  private apiUrl = 'http://localhost:8081/offres';  // Spring Boot API URL

  constructor(private http: HttpClient) { }

  getOffreById(id: number): Observable<Offre> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Offre>(url); // Return the Observable directly
  }
  getOffresByEntrepriseId(entrepriseId: number): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }
  

  // Method to fetch offers from the backend
  getOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl);
  }
  createOffre(offre: Offre): Observable<Offre> {
    return this.http.post<Offre>(this.apiUrl, offre);
  }
  updateOffre(id: number, updatedOffer: Offre): Observable<Offre> {
    return this.http.put<Offre>(`${this.apiUrl}/update/${id}`, updatedOffer);
  }
  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { responseType: 'text' as 'json' });
  }
  applyToOffer(data: { studentId: number; offerId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, data, { responseType: 'text' as 'json' });
  }

  toggleFavorite(data: { studentId: number; offerId: number; }, action: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites/add`, data, { responseType: 'text' }) as Observable<string>;
  }

  uploadCV(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-cv`, formData);
  }
  removeFavoris(data: { studentId: number; offerId: number }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/favorites/remove`, data, { responseType: 'text' as 'json' });
  }

  getAllFavoris(studentId: number): Observable<Offre[]> {
    const params = new HttpParams().set('studentId', studentId.toString());
    return this.http.get<Offre[]>(`${this.apiUrl}/favorites`, { params })
      .pipe(
        tap(response => {
          console.log('API Response:', response); // Debug response
        }),
        catchError(error => {
          console.error('Error fetching favorites:', error); // Debug error
          return throwError(error); // Propagate error
        })
      );
  }
  addFavoris(data: { studentId: number; offerId: number }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/favorites/add`, data, { responseType: 'text' as 'json' });
  }
  getApplications(studentId: number): Observable<Application[]> {
    const params = new HttpParams().set('studentId', studentId.toString());
    return this.http.get<Application[]>(`${this.apiUrl}/applications`, { params }).pipe(
      tap(response => console.log('Applications API Response:', response)),
      catchError(error => {
        console.error('Error fetching applications:', error); // Line 64
        return throwError(error);
      })
    );
  }
}
export { Offre };

