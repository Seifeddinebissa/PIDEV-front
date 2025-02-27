import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { OfferComponent } from './offer/offer.component';
import { CreateOffreComponent } from './create-offre/create-offre.component';
import { OfferStudentComponent } from './offer-student/offer-student.component';
import { FavoritesComponent } from './favorites/favorites.component';

const routes: Routes = [
  {
    path: '',
    component: FrontOfficeComponent,
    children: [
      { path: 'offre', component: OfferComponent },
      {path: 'create-offre', component:CreateOffreComponent},
      {path: 'offre-student', component:OfferStudentComponent},
      {path: 'list-fav', component:FavoritesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
