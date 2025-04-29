import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Importer ces modules
//import { ListEventComponent } from './back-office/list-event/list-event.component'; // Ton composant
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FrontOfficeModule } from './front-office/front-office.module';

import { PdfViewerModule } from 'ng2-pdf-viewer';
//import { ButtonModule } from 'primeng/button';      
import { ButtonModule } from 'primeng/button';     
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';      
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackOfficeModule } from './back-office/back-office.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

 
@NgModule({
  declarations: [
    AppComponent,
   // ListEventComponent
   //  NotificationComponent  
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [ 
    BrowserModule,
    NgxPaginationModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, // Ajout pour les formulaires réactifs
    FormsModule, // Ajout pour ngModel
    ToastrModule.forRoot(), // Configuration de Toastr
    CommonModule,
     
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      progressBar: true,
      closeButton: true,
      newestOnTop: true, 
      tapToDismiss: true,
      positionClass: 'toast-bottom-right',
      timeOut: 8000
    }),
    HttpClientModule, 
    FormsModule, // Nécessaire pour HttpClient
    RouterModule.forRoot([
      {
        path: 'back-office',
        loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule)
      },
      {
        path: 'front-office',
        loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule)
      }
    ])
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
    ]),
    BackOfficeModule,
    FrontOfficeModule,
    ButtonModule,  
    ToastrModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 