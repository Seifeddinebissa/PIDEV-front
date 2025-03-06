import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { CoursesComponent } from './courses/courses.component';
import { LessonsComponent } from './lessons/lessons.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  {
    path: '',
    component: FrontOfficeComponent,
    children: [
      {path:"courses", component:CoursesComponent} ,
      {path:"lessons/:id", component:LessonsComponent} ,
      {path:"quiz/:id", component:QuizComponent} ,
      // Add child routes here if needed
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
