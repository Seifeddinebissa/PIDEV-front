import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Reclamation } from '../models/Reclamation';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
providedIn: 'root'
})
export class ReclamationService {

apiUrl ="http://localhost:8083/reclamation";

// Mise à jour du type pour inclure totalElements
getReclamationsWithPagination(page: number, size: number, status?: string, subject?: string,description?: string ,sortField?: string,sortDirection?: 'asc' | 'desc'): Observable<{ content: Reclamation[], totalPages: number, totalElements: number }> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  if (status) {
    params = params.set('status', status);
  }
  if (subject) {
    params = params.set('subject', subject);
  }
  if (description) {
    params = params.set('description', description);
  }

  if (sortField) {
    params = params.set('sort', `${sortField},${sortDirection || 'asc'}`);
  }


  return this.http.get<{ content: Reclamation[], totalPages: number, totalElements: number }>(`${this.apiUrl}/all`, { params });
}
constructor(private http: HttpClient) {}


getReclamationById(id: number): Observable<Reclamation> {
  return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
}

addReclamation(reclamation: Reclamation): Observable<Reclamation> {
  return this.http.post<Reclamation>(`${this.apiUrl}/add`, reclamation);
}

updateReclamation(id: number, reclamation: Reclamation): Observable<Reclamation> {
  return this.http.put<Reclamation>(`${this.apiUrl}/update/${id}`, reclamation);
}

deleteReclamation(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
}

// Nouvelle méthode pour récupérer les statistiques par statut
getStatsByStatus(): Observable<{ [key: string]: number }> {
  return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/stats`);
}


// Nouvelle méthode pour récupérer toutes les réclamations (sans pagination)
getAllReclamations(): Observable<Reclamation[]> {
  return this.getReclamationsWithPagination(0, 9999, undefined, undefined, undefined, 'dateSubmitted', 'asc')
    .pipe(map(response => response.content || []));
}

// Nouvelle méthode pour exporter en PDF
exportToPDF(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/export/pdf`, { responseType: 'blob' });
}

// Nouvelle méthode pour exporter en Excel
exportToExcel(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' });
}

/*

generateResponse(prompt: string, userId: number = 1): Observable<string> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  const body = { prompt, userId }; // Inclure prompt et userId dans le corps
  return this.http.post(`${this.apiUrl}/generate`, body, { headers, responseType: 'text' });
}

*/

/*
generateResponse(prompt: string): Observable<string> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  const body = { prompt: prompt }; // Matches the GenerateRequest DTO
  return this.http.post(`${this.apiUrl}/generate`, body, { headers, responseType: 'text' });
}
*/
}


