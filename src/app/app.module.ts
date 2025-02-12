import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BackOfficeModule } from './back-office/back-office.module';
import { FrontOfficeModule } from './front-office/front-office.module';

@NgModule({
  declarations: [
    AppComponent
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
    FrontOfficeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
