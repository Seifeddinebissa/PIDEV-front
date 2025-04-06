import { Paiement } from '../models/Paiement';
import { PaiementService } from './../services/paiement.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css'],
 
})
export class PaiementComponent {
 
  constructor(private service:PaiementService) {
   }
  listPaiement:any[] = [];
  ngOnInit(): void {
    this.service.getAllPaiement().subscribe(data=>{
      this.listPaiement = data;
      console.log(data);
    });
  }
}
