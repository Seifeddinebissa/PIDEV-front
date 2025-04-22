import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'back-office', loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule) },
  { path: 'front-office', loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule) },
  { path: '', redirectTo: '/back-office', pathMatch: 'full' },
  //{ path: '', redirectTo: '/font-office', pathMatch: 'full' },
 
  
  
  //{path: '**', redirectTo: '/front-office' } // Gestion des routes inconnues

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
