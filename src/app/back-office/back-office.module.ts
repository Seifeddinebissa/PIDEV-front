import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { RouterModule } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { HttpClientModule } from '@angular/common/http';
import { FormationComponent } from './formation/formation.component';
import { FormationAddComponent } from './formation-add/formation-add.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackEditComponent } from './feedback-edit/feedback-edit.component';
import { FeedbackAddComponent } from './feedback-add/feedback-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackStatsComponent } from './feedback-stats/feedback-stats.component';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [
    BackOfficeComponent,
    PaiementComponent,
    FormationComponent,
    FormationAddComponent,
    FormationEditComponent,
    FeedbackComponent,
    FeedbackEditComponent,
    FeedbackAddComponent,
    FeedbackStatsComponent
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
    ChartModule
  ],
  exports: [BackOfficeComponent]
})
export class BackOfficeModule { }
