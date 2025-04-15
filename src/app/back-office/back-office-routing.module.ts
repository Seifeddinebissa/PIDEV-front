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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
