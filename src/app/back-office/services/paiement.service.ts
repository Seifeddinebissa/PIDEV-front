import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paiement } from '../models/Paiement';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  apiUrl = "http://localhost:8081/api/payment";
  constructor(private http: HttpClient,
    private router: Router) { }

  getAllPaiement():Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"/history");  
  }
  AddPaiement(p:Paiement):Observable<Paiement>{
    return this.http.post<Paiement>(this.apiUrl,p);  
  }
  exportStatsToPDF(paymentId:string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/`+paymentId, { responseType: 'blob' });
  }

}
