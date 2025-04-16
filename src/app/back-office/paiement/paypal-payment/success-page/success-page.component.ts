import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentExecutionRequest } from 'src/app/back-office/models/PaymentExecutionRequest';
import { PaypalService } from 'src/app/back-office/services/paypal.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit {
  exec! : PaymentExecutionRequest;
  constructor(private service:PaypalService, private route:ActivatedRoute) { }

  ngOnInit(): void {
     this.exec = new PaymentExecutionRequest();
    this.route.queryParams.subscribe(params => {
      this.exec.paymentId = params['paymentId'];
      this.exec.payerId = params['PayerID'];
    });
    this.service.executePayment(this.exec).subscribe(data=>{
      console.log(data);
    })
  }
 
}
