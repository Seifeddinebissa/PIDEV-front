import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { ListEventComponent } from '../back-office/list-event/list-event.component';
import { HomeComponent } from './home/home.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventStatsComponent } from '../back-office/event-stats/event-stats.component';
// import { EventDetailsComponent } from './events/event-details.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

import { OfferComponent } from './offer/offer.component';
import { CreateOffreComponent } from './create-offre/create-offre.component';
import { OfferStudentComponent } from './offer-student/offer-student.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AppliedComponent } from './applied/applied.component';
import { UpdateOffreModalComponent } from './update-offre-modal/update-offre-modal.component';
import { ApplyEntrepriseComponent } from './apply-entreprise/apply-entreprise.component';
import { MapComponent } from './map/map.component';
import { InterviewScheduleComponent } from './interview-schedule/interview-schedule.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { SetInterviewModalComponent } from './set-interview-modal/set-interview-modal.component';
import { StudentCalendarComponent } from './student-calendar/student-calendar.component';
import { FormationsListComponent } from './formations-list/formations-list.component';
import { CourseDetailsComponent } from './course-details/course-details.component';

const routes: Routes = [
  {

    
    path: '',
    component: FrontOfficeComponent,
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'events', component: ListEventComponent },
     // { path: 'home', component: HomeComponent },
      { path: 'list-events', component: ViewEventsComponent },
      { path: 'event-statistics', component: EventStatsComponent },
       { path: 'events/:idEvent', component: EventDetailsComponent },
      { path: 'reclamationFront', component: ReclamationComponent },
      { path: 'chat', component: ChatbotComponent },

      // Add child routes here if needed
      { path: 'offre/:entrepriseId', component: OfferComponent },
      { path: 'offre', component: OfferComponent },
      {path: 'create-offre/:idEntreprise', component:CreateOffreComponent},
      {path: 'create-offre', component:CreateOffreComponent},
      {path: 'offre-student', component:OfferStudentComponent},
      { path: 'offre-student/:studentId', component: OfferStudentComponent },
      {path: 'list-fav', component:FavoritesComponent},
      {path: 'list-apply', component:AppliedComponent},
      {path: 'list-apply-entre', component:ApplyEntrepriseComponent},
      {path: 'update-offre-modal', component:UpdateOffreModalComponent},
      {path: 'update-offre-modal/:id', component:UpdateOffreModalComponent},
      { path: 'interview/:id', component: InterviewScheduleComponent },
      {path: 'map', component:MapComponent},
      {path: 'appoinment', component:StudentDashboardComponent},
      {path: 'set-interview/:id', component:SetInterviewModalComponent},
      {path: 'calendar', component:StudentCalendarComponent},
      { path: 'formation', component: FormationsListComponent },
      { path: 'course-details/:id', component: CourseDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }


// // src/app/front-office/front-office-routing.module.ts
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { FrontOfficeComponent } from './front-office.component';
// import { EventDetailsComponent } from './event-details/event-details.component';
// import { GetAllEventComponent } from './get-all-event/get-all-event.component';
// import { HomeComponent } from './home/home.component';
// import { ListEventComponent } from '../back-office/list-event/list-event.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: FrontOfficeComponent,
//     children: [
//       { path: '', redirectTo: 'home', pathMatch: 'full' },
//       { path: 'home', component: HomeComponent },
//       { path: 'event-details', component: EventDetailsComponent },
//       { path: 'get-all-event', component: GetAllEventComponent },
//       { path: 'list-event', component: ListEventComponent }
//     ]
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class FrontOfficeRoutingModule { }