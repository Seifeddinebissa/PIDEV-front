import { Component } from '@angular/core';
import { PaypalService } from '../../services/paypal.service';
import { PaymentResponse } from '../../models/PaymentResponse';

@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.css']
})
export class PaypalPaymentComponent {

  constructor(private service:PaypalService){}
  createPayment(){
    this.service.createPayment().subscribe(data=>{
      console.log("Payment created")
      console.log(data)
      window.open(data.approvalUrl, "_blank")
    })
  }
}
