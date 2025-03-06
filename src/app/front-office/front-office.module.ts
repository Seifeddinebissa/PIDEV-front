import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { Router, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { LessonsComponent } from './lessons/lessons.component';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './safe.pipe';
import { QuizComponent } from './quiz/quiz.component';


@NgModule({
  declarations: [
    FrontOfficeComponent,
    CoursesComponent,
    LessonsComponent,
    SafePipe,
    QuizComponent
    
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
    FormsModule
  ],
  exports: [FrontOfficeComponent]
})
export class FrontOfficeModule { }
