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
  
}