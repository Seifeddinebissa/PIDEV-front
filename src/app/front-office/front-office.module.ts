import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ajouté pour ngModel
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { Router, RouterModule } from '@angular/router';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { HttpClientModule } from '@angular/common/http';
import { Reclamation } from '../back-office/models/Reclamation';
import { ReclamationService } from '../back-office/services/reclamation.service';
@NgModule({
  declarations: [
    FrontOfficeComponent,
    ReclamationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    /*RouterModule.forChild([
      {
        path: '',
        component: FrontOfficeComponent
      }
    ]),*/
    RouterModule,
    FrontOfficeRoutingModule
  ],
  exports: [FrontOfficeComponent]
})
export class FrontOfficeModule { }
