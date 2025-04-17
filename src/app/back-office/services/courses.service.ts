import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:8088/dorra/cours';

  constructor(private http: HttpClient) { }

  getAllCours(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAll`);
  }



  addCours(titre: string, description: string, image?: File, pdfs: File[] = []): Observable<any> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    if (image) {
      formData.append('image', image, image.name);
    }
    if (pdfs && pdfs.length > 0) {
      pdfs.forEach((pdf, index) => {
        formData.append('pdfs', pdf, pdf.name); // 'pdfs' correspond au @RequestParam du backend
      });
    }
    return this.http.post(`${this.apiUrl}/add`, formData);
  }


  deleteCours(idCours: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${idCours}`);
  }

  getCoursById(idCours: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${idCours}`);
  }



  updateCours(idCours: number, titre: string, description: string, image?: File, pdfs: File[] = [], contenu: string[] = []): Observable<any> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    if (image) {
      formData.append('image', image, image.name);
    }
    if (pdfs && pdfs.length > 0) {
      pdfs.forEach((pdf) => formData.append('pdfs', pdf, pdf.name));
    }
    formData.append('contenu', JSON.stringify(contenu)); // Envoie la liste des PDFs existants mise à jour
    return this.http.put(`${this.apiUrl}/update/${idCours}`, formData);
  }


  getCoursByTitre(titre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/byTitre?titre=${encodeURIComponent(titre)}`);
  }
  

  generateMeetLink(courseName: string, scheduledAt: string, password: string): Observable<any> {
    const request = { courseName, scheduledAt, password };
    return this.http.post<any>(`${this.apiUrl}/generate-meet`, request);
  }

  getAllMeetingLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/meeting-links`);
  }

  getMeetingLinkById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/meeting-links/${id}`);
  }

  getUpcomingMeetingLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/meeting-links/upcoming`);
  }

  deactivateMeetingLink(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/meeting-links/${id}/deactivate`, {});
  }

  deleteMeetingLink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meeting-links/${id}`);
  }

  updateMeetingLink(id: number, courseName: string, scheduledAt: string, password: string, active: boolean): Observable<any> {
    const request = { courseName, scheduledAt, password, active };
    return this.http.put<any>(`${this.apiUrl}/meeting-links/${id}`, request);
  }
}