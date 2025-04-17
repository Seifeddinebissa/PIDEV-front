// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/frontoffice', pathMatch: 'full' },
  { 
    path: 'frontoffice', 
    loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule) 
  },
  { 
    path: 'backoffice', 
    loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule) 
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }