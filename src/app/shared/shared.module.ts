import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEventComponent } from '../back-office/list-event/list-event.component';
import { FormsModule } from '@angular/forms'; // Nécessaire pour ngModel dans ListEventComponent
import { ToastrModule } from 'ngx-toastr'; // Nécessaire pour les notifications
 import { ReactiveFormsModule } from '@angular/forms'; // For reactive and template-driven forms
 
@NgModule({
  declarations: [
    ListEventComponent // Déclaration de ListEventComponent ici
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // For reactive forms
      FormsModule, // Importé pour ngModel
    ToastrModule.forRoot() // Importé pour les notifications
  ],
  exports: [
    ListEventComponent, // Exporté pour être utilisé dans d'autres modules
     CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }