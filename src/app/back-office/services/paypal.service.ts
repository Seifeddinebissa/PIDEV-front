import { PaymentExecutionRequest } from './../models/PaymentExecutionRequest';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentRequest } from '../models/PaymentRequest';
import { PaymentResponse } from '../models/PaymentResponse';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  apiUrl = "http://localhost:8081/api/payment";
  paymentRequest:PaymentRequest = new PaymentRequest();
  constructor(private http:HttpClient) { }

  createPayment():Observable<PaymentResponse>{
    this.paymentRequest.amount=10.0;
    this.paymentRequest.currency="USD";
    this.paymentRequest.description="Achat d'un produit";
    this.paymentRequest.cancelUrl="https://your-ngrok-subdomain.ngrok.io/cancel";
    this.paymentRequest.successUrl="http://localhost:4200/success";
    return this.http.post<any>(this.apiUrl+"/create",this.paymentRequest);

  }

  executePayment(exec:PaymentExecutionRequest):Observable<any>{
    return this.http.post<PaymentExecutionRequest>(this.apiUrl+"/execute",exec);
  }
}
