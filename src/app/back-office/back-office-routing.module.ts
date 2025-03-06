import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { BackOfficeComponent } from './back-office.component';
import { ReclamationComponent } from '../front-office/reclamation/reclamation.component';
import { ListreclamationComponent } from './listreclamation/listreclamation.component';


const routes: Routes = [
  {
    path: '',
    component: BackOfficeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Par défaut, affiche une vue dashboard vide ou un composant dédié
      { path: 'paiement', component: PaiementComponent },
      { path: 'reclamation', component: ListreclamationComponent },
      //{ path: '', redirectTo: 'reclamations', pathMatch: 'full' } // Optionnel : route par défaut
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
