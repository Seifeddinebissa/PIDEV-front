import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    BackOfficeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BackOfficeComponent
      }
    ]),
    BackOfficeRoutingModule
  ]
})
export class BackOfficeModule { }
