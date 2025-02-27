import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@NgModule({
  declarations: [
    BackOfficeComponent,
    PaiementComponent,
    EntrepriseComponent,
    AddEntrepriseComponent,
    UpdateEntrepriseComponent
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
    ReactiveFormsModule
    
  ],
  exports: [BackOfficeComponent]
})
export class BackOfficeModule { }
