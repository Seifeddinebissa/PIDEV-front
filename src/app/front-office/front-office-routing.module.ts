import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { GetAllEventComponent } from './get-all-event/get-all-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { FavoriteEventsComponent } from './favorite-events/favorite-events.component';
import { HomeComponent } from './home/home.component';
import { ViewEventsComponent } from './view-events/view-events.component';
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
import { ListEventComponent } from '../back-office/list-event/list-event.component';
import { EventStatsComponent } from '../back-office/event-stats/event-stats.component';

const routes: Routes = [
  {
    path: '',
    component: FrontOfficeComponent,
    children: [
    //  { path: '', redirectTo: 'events', pathMatch: 'full' },
     {path:'event-stat', component:EventStatsComponent},
      { path: 'list-event', component: GetAllEventComponent },
     {path:'view-event', component:ViewEventsComponent},
      { path: 'events/:idEvent', component: EventDetailsComponent },
      { path: 'favorite-events', component: FavoriteEventsComponent },
      { path: 'home', component: HomeComponent },
      { path: 'list-events', component: ViewEventsComponent },
      { path: 'reclamationFront', component: ReclamationComponent },
      { path: 'chat', component: ChatbotComponent },
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