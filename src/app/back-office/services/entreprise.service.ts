import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise, PageResponse } from '../models/Entreprise';
import { SafeUrl } from '@angular/platform-browser';




@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl = 'http://localhost:8081/companies';

  constructor(private http: HttpClient) {}

  getEntreprises(page: number = 0, size: number = 5): Observable<PageResponse<Entreprise>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Entreprise>>(this.apiUrl, { params });
  }
  
  
  getEntreprisesLogo(path:string | SafeUrl): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/images${path}`, { responseType: 'blob' });
  }

  getEntrepriseById(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/${id}`);
  }

  addEntreprise(formData: FormData): Observable<Entreprise> {
    return this.http.post<Entreprise>(this.apiUrl, formData);
  }

  updateEntreprise(id: number, entrepriseData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, entrepriseData);
  }

  deleteEntreprise(id: number): Observable<string> { // Change return type
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' }) as Observable<string>;
  }

}
