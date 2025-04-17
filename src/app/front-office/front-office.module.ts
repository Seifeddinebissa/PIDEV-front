// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FrontOfficeRoutingModule } from './front-office-routing.module';
// import { FrontOfficeComponent } from './front-office.component';
// import { RouterModule } from '@angular/router';
// import { GetAllEventComponent } from './get-all-event/get-all-event.component';
// import { EventDetailsComponent } from './event-details/event-details.component';
//  import { HttpClientModule } from '@angular/common/http';
// import { ViewEventsComponent } from './view-events/view-events.component';
// import { HomeComponent } from './home/home.component';
// import { EventComponent } from './event/event.component';
// import { NotificationComponent } from './notification/notification.component';
//  //import { ToastrModule } from 'ngx-toastr';
//  @NgModule({
//   declarations: [
//     FrontOfficeComponent,
//     GetAllEventComponent,
//     EventDetailsComponent,
//     HomeComponent,
//     EventComponent,
//     NotificationComponent
//   ],
//   imports: [
//     HttpClientModule,
//     CommonModule,
//     RouterModule,
//     FrontOfficeRoutingModule
//   //  ToastrModule
//   ],
//   exports: [FrontOfficeComponent]
// })
// export class FrontOfficeModule { }import { ToastrModule } from 'ngx-toastr';

 
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FrontOfficeComponent } from './front-office.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { GetAllEventComponent } from './get-all-event/get-all-event.component';
import { HomeComponent } from './home/home.component';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { SharedModule } from '../shared/shared.module'; // Import de SharedModule
import { RouterModule } from '@angular/router';
import { ListEventComponent } from '../back-office/list-event/list-event.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [
    FrontOfficeComponent,
    EventDetailsComponent,
    GetAllEventComponent,
    HomeComponent,
    // ListEventComponent 
  ],
  imports: [
    RouterModule,
    FrontOfficeRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule
  ],
  providers: [
    DatePipe // Add DatePipe to providers
  ]
})
export class FrontOfficeModule { }