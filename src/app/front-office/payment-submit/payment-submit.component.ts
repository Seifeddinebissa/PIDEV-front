import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-submit',
  templateUrl: './payment-submit.component.html',
  styleUrls: ['./payment-submit.component.css']
})
export class PaymentSubmitComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  submitPayment(): void {
    // Implementation will be added later
    console.log('Payment submitted');
  }
} 