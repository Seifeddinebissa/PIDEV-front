import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { ChatbotComponent } from './chatbot/chatbot.component';


const routes: Routes = [
  {

    
    path: '',
    component: FrontOfficeComponent,
    children: [
      { path: 'reclamationFront', component: ReclamationComponent },
      { path: 'chat', component: ChatbotComponent }

      // Add child routes here if needed
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
