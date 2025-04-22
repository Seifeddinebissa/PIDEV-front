import { PaiementService } from './../../services/paiement.service';
import { Component } from '@angular/core';
import { PaymentMethodEnum } from '../../models/PaymentMethodEnum';
import { Paiement } from '../../models/Paiement';

@Component({
  selector: 'app-add-paiement',
  templateUrl: './add-paiement.component.html',
  styleUrls: ['./add-paiement.component.css']
})
export class AddPaiementComponent {
  paymentMethods = Object.entries(PaymentMethodEnum).map(([key, value]) => value);
  
  payment= new Paiement();
  constructor(private service : PaiementService){console.log(this.paymentMethods);}
  save(){
    this.service.AddPaiement(this.payment).subscribe(data=>{
      
      console.log(data);
    });
  }
}
