import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { Router, RouterModule } from '@angular/router';
import { FormationsListComponent } from './formations-list/formations-list.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    FrontOfficeComponent,
    FormationsListComponent,
    CourseDetailsComponent
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
    FrontOfficeRoutingModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  exports: [FrontOfficeComponent]
})
export class FrontOfficeModule { }
