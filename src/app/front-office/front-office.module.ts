import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReclamationComponent } from './reclamation/reclamation.component';
import { Reclamation } from '../back-office/models/Reclamation';
import { ReclamationService } from '../back-office/services/reclamation.service';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { Router, RouterModule } from '@angular/router';
import { CreateOffreComponent } from './create-offre/create-offre.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateOffreModalComponent } from './update-offre-modal/update-offre-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { OfferComponent } from './offer/offer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OfferStudentComponent } from './offer-student/offer-student.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AppliedComponent } from './applied/applied.component';
import { ApplyEntrepriseComponent } from './apply-entreprise/apply-entreprise.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrModule } from 'ngx-toastr';
import { MapComponent } from './map/map.component';
import { InterviewScheduleComponent } from './interview-schedule/interview-schedule.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SetInterviewModalComponent } from './set-interview-modal/set-interview-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Import this
import { StudentCalendarComponent } from './student-calendar/student-calendar.component';
import { FormationsListComponent } from './formations-list/formations-list.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    FrontOfficeComponent,
    ReclamationComponent,
    ChatbotComponent,
    
    
    
    OfferComponent,
    CreateOffreComponent,
    UpdateOffreModalComponent,
    OfferStudentComponent,
    FavoritesComponent,
    AppliedComponent,
    ApplyEntrepriseComponent,
    MapComponent,
    InterviewScheduleComponent,
    StudentDashboardComponent,
    SetInterviewModalComponent,
    StudentCalendarComponent,
    FormationsListComponent,
    CourseDetailsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    FormsModule,
    CommonModule,

    PdfViewerModule,
    NgxExtendedPdfViewerModule

    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatNativeDateModule,
    MatInputModule, 
    RouterModule,
    FrontOfficeRoutingModule,
    MatSnackBarModule,
    ToastrModule.forRoot({
      timeOut: 5000, // Duration in milliseconds
      positionClass: 'toast-top-right',// Position of the toast
      preventDuplicates: true,
      progressBar: true, // Show a progress bar
      closeButton: true, // Show a close button
      toastClass: 'ngx-toastr', // Default class
      titleClass: 'toast-title', // Class for the title
      messageClass: 'toast-message', // Class for the message
      tapToDismiss: true, // Dismiss on click
      enableHtml: true, // Allow HTML in the message
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  exports: [FrontOfficeComponent]
})
export class FrontOfficeModule { }
