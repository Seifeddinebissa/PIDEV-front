import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paiement } from '../models/Paiement';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  apiUrl = "http://localhost:8080/api/paiement";
  constructor(private http: HttpClient,
    private router: Router) { }

  getAllPaiement():Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"/get-all");  
  }

}
