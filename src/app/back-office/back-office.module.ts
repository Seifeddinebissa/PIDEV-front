import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { RouterModule } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { HttpClientModule } from '@angular/common/http';
import { CoursesComponent } from './courses/courses.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { FormsModule } from '@angular/forms';
import { UpdateCourseComponent } from './update-course/update-course.component';
import { QuizComponent } from './quiz/quiz.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuizAttemptsComponent } from './quiz-attempts/quiz-attempts.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    PaiementComponent,
    CoursesComponent,
    AddCourseComponent,
    UpdateCourseComponent,
    QuizComponent,
    AddQuestionComponent,
    QuizAttemptsComponent,
    AdminCoursesComponent
  ],
  imports: [
    CommonModule,
    /*RouterModule.forChild([
      {
        path: '',
        component: BackOfficeComponent
      }
    ]),*/
    RouterModule,
    BackOfficeRoutingModule,
    HttpClientModule,
    FormsModule
    
  ],
  exports: [BackOfficeComponent]
})
export class BackOfficeModule { }
