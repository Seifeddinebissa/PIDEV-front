import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { ListEventComponent } from '../back-office/list-event/list-event.component';
import { HomeComponent } from './home/home.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventStatsComponent } from '../back-office/event-stats/event-stats.component';
// import { EventDetailsComponent } from './events/event-details.component';

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
       { path: 'events/:idEvent', component: EventDetailsComponent }
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