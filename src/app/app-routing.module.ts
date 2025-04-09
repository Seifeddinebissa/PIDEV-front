import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsComponent } from './front-office/event-details/event-details.component';
import { ListEventComponent } from './back-office/list-event/list-event.component';
 
const routes: Routes = [
  { path: 'events', component: ListEventComponent },
  { path: 'event-details/:idEvent', component: EventDetailsComponent }, // Route for event details
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: '**', redirectTo: '/events' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }