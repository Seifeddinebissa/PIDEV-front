import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { GetAllEventComponent } from './get-all-event/get-all-event.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: FrontOfficeComponent,
    children: [ 
      { path: 'event-details', component: EventDetailsComponent },
      //{ path: 'view-events', component: ViewEventsComponent },
      { path: 'get-all-event', component: GetAllEventComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
      // Add child routes here if needed
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }