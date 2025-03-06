import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { Router, RouterModule } from '@angular/router';
import { CreateOffreComponent } from './create-offre/create-offre.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateOffreModalComponent } from './update-offre-modal/update-offre-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { OfferComponent } from './offer/offer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OfferStudentComponent } from './offer-student/offer-student.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AppliedComponent } from './applied/applied.component';
import { ApplyEntrepriseComponent } from './apply-entreprise/apply-entreprise.component';



@NgModule({
  declarations: [
    FrontOfficeComponent,
    OfferComponent,
    CreateOffreComponent,
    UpdateOffreModalComponent,
    OfferStudentComponent,
    FavoritesComponent,
    AppliedComponent,
    ApplyEntrepriseComponent,
    
    
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    RouterModule,
    FrontOfficeRoutingModule
  ],
  exports: [FrontOfficeComponent]
})
export class FrontOfficeModule { }
