import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { RouterModule } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { HttpClientModule } from '@angular/common/http';
import { AddPaiementComponent } from './paiement/add-paiement/add-paiement.component';
import { FormsModule } from '@angular/forms';
import { PaypalPaymentComponent } from './paiement/paypal-payment/paypal-payment.component';
import { SuccessPageComponent } from './paiement/paypal-payment/success-page/success-page.component';
import { CancelPageComponent } from './paiement/paypal-payment/cancel-page/cancel-page.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    PaiementComponent,
    AddPaiementComponent,
    PaypalPaymentComponent,
    SuccessPageComponent,
    CancelPageComponent,
    ProfileComponent,
    EditProfileComponent,
    UtilisateursComponent
  ],
  imports: [
    CommonModule,
    /*RouterModule.forChild([
      {
        path: '',
        component: BackOfficeComponent
      }
    ]),*/
    RouterModule,
    BackOfficeRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [BackOfficeComponent]
})
export class BackOfficeModule { }
