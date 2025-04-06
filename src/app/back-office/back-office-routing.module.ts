import { PaypalPaymentComponent } from './paiement/paypal-payment/paypal-payment.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { BackOfficeComponent } from './back-office.component';
import { AddPaiementComponent } from './paiement/add-paiement/add-paiement.component';
import { SuccessPageComponent } from './paiement/paypal-payment/success-page/success-page.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: BackOfficeComponent,
    children: [
      { path: 'paiement', component: PaiementComponent },
      { path: 'add-paiement', component: AddPaiementComponent },
      {path:"payer", component:PaypalPaymentComponent},
      {path:"success", component:SuccessPageComponent},
      {path:"profile",component:ProfileComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
