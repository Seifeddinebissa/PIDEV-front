import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement/paiement.component';
import { BackOfficeComponent } from './back-office.component';
import { CoursesComponent } from './courses/courses.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { UpdateCourseComponent } from './update-course/update-course.component';
import { QuizComponent } from './quiz/quiz.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuizAttemptsComponent } from './quiz-attempts/quiz-attempts.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';

const routes: Routes = [
  {
    path: '',
    component: BackOfficeComponent,
    children: [
      { path: 'paiement', component: PaiementComponent },
      {path:"courses", component:CoursesComponent} ,
      {path:"Addcourse", component:AddCourseComponent} ,
      {path:"UpdateCourse/:id", component:UpdateCourseComponent} ,
      {path:"Quiz/:id", component:QuizComponent} ,
      {path:"questions/add/:quizId", component:AddQuestionComponent} ,
      {path:"QiuzAttempts", component:QuizAttemptsComponent} ,
      {path:"adminCourses", component:AdminCoursesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
