import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { Router, RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    FrontOfficeComponent
  ],
  imports: [
    CommonModule,
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
