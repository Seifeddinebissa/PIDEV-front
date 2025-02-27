import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise } from '../models/Entreprise';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl = 'http://localhost:8081/companies';

  constructor(private http: HttpClient) {}

  getEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(this.apiUrl);
  }

  getEntrepriseById(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/${id}`);
  }

  addEntreprise(formData: FormData): Observable<Entreprise> {
    return this.http.post<Entreprise>(this.apiUrl, formData);
  }

  updateEntreprise(id: number, entrepriseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, entrepriseData);
  }

  deleteEntreprise(id: number): Observable<string> { // Change return type
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' }) as Observable<string>;
  }

}
