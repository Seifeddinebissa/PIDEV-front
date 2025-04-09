import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { RouterModule } from '@angular/router';
import { GetAllEventComponent } from './get-all-event/get-all-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
 import { HttpClientModule } from '@angular/common/http';
import { ViewEventsComponent } from './view-events/view-events.component';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './event/event.component';
import { NotificationComponent } from './notification/notification.component';
 //import { ToastrModule } from 'ngx-toastr';
 @NgModule({
  declarations: [
    FrontOfficeComponent,
    GetAllEventComponent,
    EventDetailsComponent,
    HomeComponent,
    EventComponent,
    NotificationComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    FrontOfficeRoutingModule
  //  ToastrModule
  ],
  exports: [FrontOfficeComponent]
})
export class FrontOfficeModule { }import { ToastrModule } from 'ngx-toastr';

