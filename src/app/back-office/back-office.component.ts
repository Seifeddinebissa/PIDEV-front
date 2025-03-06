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

}
