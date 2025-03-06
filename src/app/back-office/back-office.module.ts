import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { RouterModule } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { HttpClientModule } from '@angular/common/http';
//import { ReclamationComponent } from './reclamation/reclamation.Component';
import { FormsModule } from '@angular/forms';

import { ListreclamationComponent } from './listreclamation/listreclamation.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    PaiementComponent,
   
    ListreclamationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    /*RouterModule.forChild([
      {
        path: '',
        component: BackOfficeComponent
      }
    ]),*/
    RouterModule,
    BackOfficeRoutingModule,
    HttpClientModule,
    
  ],
  exports: [BackOfficeComponent]
})
export class BackOfficeModule { }
