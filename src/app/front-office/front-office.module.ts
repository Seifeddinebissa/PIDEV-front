import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { CreateOffreComponent } from './create-offre/create-offre.component';
import { UpdateOffreModalComponent } from './update-offre-modal/update-offre-modal.component';
import { OfferComponent } from './offer/offer.component';
import { OfferStudentComponent } from './offer-student/offer-student.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AppliedComponent } from './applied/applied.component';
import { ApplyEntrepriseComponent } from './apply-entreprise/apply-entreprise.component';
import { MapComponent } from './map/map.component';
import { InterviewScheduleComponent } from './interview-schedule/interview-schedule.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { SetInterviewModalComponent } from './set-interview-modal/set-interview-modal.component';
import { StudentCalendarComponent } from './student-calendar/student-calendar.component';
import { FormationsListComponent } from './formations-list/formations-list.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { GetAllEventComponent } from './get-all-event/get-all-event.component';
import { NotificationComponent } from './notification/notification.component';
import { FavoriteEventsComponent } from './favorite-events/favorite-events.component';

@NgModule({
  declarations: [
    FrontOfficeComponent,
    ReclamationComponent,
    ChatbotComponent,
    EventDetailsComponent,
    GetAllEventComponent,
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
    CourseDetailsComponent,
    NotificationComponent,
    FavoriteEventsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FrontOfficeRoutingModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    NgxPaginationModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [DatePipe]
})
export class FrontOfficeModule { }