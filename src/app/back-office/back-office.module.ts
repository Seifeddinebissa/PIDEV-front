import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { PaiementComponent } from './paiement/paiement.component';
import { EventComponent } from './event/event.component'; 
import { ListEventComponent } from './list-event/list-event.component';
import { EventsService } from './services/event.service'; 
import { ToastrModule } from 'ngx-toastr';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    BackOfficeComponent,
    PaiementComponent,
    EventComponent, 
    ListEventComponent
  ],
  imports: [
    BackOfficeRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
   // BrowserAnimationsModule, // Nécessaire pour Toastr
    ToastrModule.forRoot() 
  ],
  providers: [EventsService],
})
export class BackOfficeModule { }