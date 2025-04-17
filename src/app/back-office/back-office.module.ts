// src/app/back-office/back-office.module.ts
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventsService } from './services/event.service';
import { ToastrModule } from 'ngx-toastr';
import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { EventStatsComponent } from './event-stats/event-stats.component';
import { EventStatisticsService } from './services/event-statistics.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BackOfficeComponent,
    EventStatsComponent
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    EventsService, 
    EventStatisticsService
  ]
})
export class BackOfficeModule { }