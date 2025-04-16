import { PaypalPaymentComponent } from './paiement/paypal-payment/paypal-payment.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { BackOfficeComponent } from './back-office.component';
import { FormationComponent } from './formation/formation.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';
import { FormationAddComponent } from './formation-add/formation-add.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackEditComponent } from './feedback-edit/feedback-edit.component';
import { FeedbackAddComponent } from './feedback-add/feedback-add.component';
import { FeedbackStatsComponent } from './feedback-stats/feedback-stats.component';
import { AddPaiementComponent } from './paiement/add-paiement/add-paiement.component';
import { SuccessPageComponent } from './paiement/paypal-payment/success-page/success-page.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';

const routes: Routes = [
  {
    path: '',
    component: BackOfficeComponent,
    children: [
      { path: 'paiement', component: PaiementComponent },
      { path: 'formations', component: FormationComponent },
      { path: 'formations/edit/:id', component: FormationEditComponent },
      { path: 'formations/add', component: FormationAddComponent },
      { path: 'feedbacks', component: FeedbackComponent },
      { path: 'feedbacks/edit/:id', component: FeedbackEditComponent },
      { path: 'feedbacks/add', component: FeedbackAddComponent },
      { path: 'feedback-stats', component: FeedbackStatsComponent }
      { path: 'add-paiement', component: AddPaiementComponent },
      {path:"payer", component:PaypalPaymentComponent},
      {path:"success", component:SuccessPageComponent},
      {path:"profile",component:ProfileComponent},
      {path:"settings/:id",component:EditProfileComponent},
      {path:"utilisateurs",component:UtilisateursComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
