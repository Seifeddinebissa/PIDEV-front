import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventsService } from './services/event.service';
import { ToastrModule } from 'ngx-toastr';
import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { EventStatsComponent } from './event-stats/event-stats.component';
import { EventStatisticsService } from './services/event-statistics.service';
import { SharedModule } from '../shared/shared.module';
import { ListreclamationComponent } from './listreclamation/listreclamation.component';
import { ChatManagementComponent } from './chat-management/chat-management.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { AddEntrepriseComponent } from './add-entreprise/add-entreprise.component';
import { UpdateEntrepriseComponent } from './update-entreprise/update-entreprise.component';
import { StatOffreComponent } from './stat-offre/stat-offre.component';
import { NgChartsModule } from 'ng2-charts';
import { FormationComponent } from './formation/formation.component';
import { FormationAddComponent } from './formation-add/formation-add.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackEditComponent } from './feedback-edit/feedback-edit.component';
import { FeedbackAddComponent } from './feedback-add/feedback-add.component';
import { FeedbackStatsComponent } from './feedback-stats/feedback-stats.component';
import { ChartModule } from 'primeng/chart';
import { AddPaiementComponent } from './paiement/add-paiement/add-paiement.component';
import { PaypalPaymentComponent } from './paiement/paypal-payment/paypal-payment.component';
import { SuccessPageComponent } from './paiement/paypal-payment/success-page/success-page.component';
import { CancelPageComponent } from './paiement/paypal-payment/cancel-page/cancel-page.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { PaiementComponent } from './paiement/paiement.component';
import { RouterModule } from '@angular/router';
import { ListEventComponent } from './list-event/list-event.component'; // Add this import

@NgModule({
  declarations: [
    BackOfficeComponent,
    EventStatsComponent,
    ListreclamationComponent,
    ChatManagementComponent,
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
    UtilisateursComponent,
    PaiementComponent,
    ListEventComponent // Add this to declarations
  ],
  imports: [
    CommonModule, // Provides ngClass, ngIf, date pipe, etc.
    FormsModule, // Provides ngModel for template-driven forms
    ReactiveFormsModule, // Provides formGroup for reactive forms
    HttpClientModule,
    RouterModule,
    BackOfficeRoutingModule,
    SharedModule,
    ToastrModule,
    NgChartsModule,
    ChartModule
  ],
  providers: [
    DatePipe, // Ensure DatePipe is available for the date pipe
    DecimalPipe,
    EventsService,
    EventStatisticsService
  ]
})
export class BackOfficeModule { }