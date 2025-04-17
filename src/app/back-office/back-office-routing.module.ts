// src/app/back-office/back-office-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office.component';
import { ListEventComponent } from './list-event/list-event.component';
import { EventStatsComponent } from './event-stats/event-stats.component';

const routes: Routes = [
  {
    path: '',
    component: BackOfficeComponent,
    children: [
      { path: '', redirectTo: 'list-event', pathMatch: 'full' },
      { path: 'event-statistics', component: EventStatsComponent },
      { path: 'list-event', component: ListEventComponent },
     // { path: 'list-event', component: ListEventComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }