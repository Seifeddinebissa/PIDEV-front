import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { RouterModule } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { HttpClientModule } from '@angular/common/http';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { AddEntrepriseComponent } from './add-entreprise/add-entreprise.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateEntrepriseComponent } from './update-entreprise/update-entreprise.component';
import { StatOffreComponent } from './stat-offre/stat-offre.component';
import { NgChartsModule } from 'ng2-charts';
import { FormationComponent } from './formation/formation.component';
import { FormationAddComponent } from './formation-add/formation-add.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackEditComponent } from './feedback-edit/feedback-edit.component';
import { FeedbackAddComponent } from './feedback-add/feedback-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackStatsComponent } from './feedback-stats/feedback-stats.component';
import { ChartModule } from 'primeng/chart';
import { AddPaiementComponent } from './paiement/add-paiement/add-paiement.component';
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
    EntrepriseComponent,
    AddEntrepriseComponent,
    UpdateEntrepriseComponent,
    StatOffreComponent,
    FormationComponent,
    FormationAddComponent,
    FormationEditComponent,
    FeedbackComponent,
    FeedbackEditComponent,
    FeedbackAddComponent,
    FeedbackStatsComponent,
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
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    ChartModule
  ],
  exports: [BackOfficeComponent]
})
export class BackOfficeModule { }
