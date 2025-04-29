import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Formation } from '../models/Formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  apiUrl = "http://localhost:8081/api/formations";
  apiUrlfeedbacks = "http://localhost:8081/api/feedbacks";

  private favoritesSubject = new BehaviorSubject<number[]>([]); // Holds the list of favorite formation IDs
  favorites$ = this.favoritesSubject.asObservable(); // Observable for components to subscribe to

  constructor(private http: HttpClient, private router: Router) {}

  getAllFormation(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/get-all`);
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  updateFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  updateFormationWithImage(id: number, formData: FormData): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formData);
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addFormationWithImage(formData: FormData): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/create`, formData);
  }

  getFeedbackCountByFormation(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/feedback-count`);
  }

  getFeedbacksByFormation(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlfeedbacks}/formation/${id}/non-hidden`);
  }

  addToFavorites(userId: number, formationId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favorites/${userId}/${formationId}`, {}).pipe(
      tap({
        next: () => {
          console.log(`Successfully added formation ${formationId} to favorites for user ${userId}`);
          this.loadFavorites(userId); // Update the BehaviorSubject
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
          this.loadFavorites(userId); // Still update favorites to reflect the actual state
        }
      }),
      catchError(error => {
        console.error('Caught error in addToFavorites:', error);
        return of({ message: 'Failed to add to favorites' }); // Return a fallback response
      })
    );
  }

  removeFromFavorites(userId: number, formationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favorites/${userId}/${formationId}`).pipe(
      tap({
        next: () => {
          console.log(`Successfully removed formation ${formationId} from favorites for user ${userId}`);
          this.loadFavorites(userId); // Update the BehaviorSubject
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
          this.loadFavorites(userId); // Still update favorites to reflect the actual state
        }
      }),
      catchError(error => {
        console.error('Caught error in removeFromFavorites:', error);
        return of({ message: 'Failed to remove from favorites' }); // Return a fallback response
      })
    );
  }

  getFavorites(userId: number): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/favorites/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return of([]); // Return empty array on error
      })
    );
  }

  loadFavorites(userId: number): void {
    this.getFavorites(userId).subscribe({
      next: (favorites) => {
        const favoriteIds = favorites.map(f => f.id);
        console.log('Emitting favorites:', favoriteIds);
        this.favoritesSubject.next(favoriteIds);
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.favoritesSubject.next([]); // Emit empty array on error
      }
    });
  }
}