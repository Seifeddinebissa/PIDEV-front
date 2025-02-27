import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { BackOfficeComponent } from './back-office.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { AddEntrepriseComponent } from './add-entreprise/add-entreprise.component';
import { UpdateEntrepriseComponent } from './update-entreprise/update-entreprise.component';

const routes: Routes = [
  {
    path: '',
    component: BackOfficeComponent,
    children: [
      { path: 'entreprises', component: EntrepriseComponent },
      { path: 'paiement', component: PaiementComponent },
      { path: 'add-entreprise', component: AddEntrepriseComponent },
      { path: 'update-entreprise', component: UpdateEntrepriseComponent },
      { path: 'update-entreprise/:id', component: UpdateEntrepriseComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
