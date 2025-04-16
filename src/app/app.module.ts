import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FrontOfficeModule } from './front-office/front-office.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';      
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackOfficeModule } from './back-office/back-office.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {
        path: 'back-office',
        loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule)
      },
      {
        path: 'front-office',
        loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule)
      }
    ]),
    BackOfficeModule,
    FrontOfficeModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
