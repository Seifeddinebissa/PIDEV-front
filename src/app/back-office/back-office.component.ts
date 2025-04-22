import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent {
 
  constructor(private router: Router) {}

  // Méthode pour naviguer vers les réclamations avec un log
  navigateToReclamations(): void {
    console.log('Clic sur Réclamation - Navigation vers /back-office/reclamations');
    this.router.navigate(['/back-office/reclamations']);
  }

  // Méthode pour naviguer vers la gestion des conversations avec un log
  navigateToChats(): void {
    console.log('Clic sur Gestion des Conversations - Navigation vers /admin/chats');
    this.router.navigate(['/admin/chats']);
  }

}
