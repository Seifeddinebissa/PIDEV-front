import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { Router, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { LessonsComponent } from './lessons/lessons.component';
import { SafePipe } from './safe.pipe';


@NgModule({
  declarations: [
    FrontOfficeComponent,
    CoursesComponent,
    LessonsComponent,
    SafePipe
    
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
