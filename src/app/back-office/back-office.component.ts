import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent {
 
  constructor(private router: Router,private authService: AuthenticationService) {}

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

   user: User | null = null;
   imageUrl: string | null = null;
 

 
   ngOnInit() {
     this.authService.getProfile().subscribe({
       next: (user) => {
         this.user = user;
         this.loadImage();
       },
       error: () => console.error('Failed to load profile')
     });
   }
 
   loadImage() {
     this.authService.getProfileImage().subscribe({
       next: (blob) => {
         const reader = new FileReader();
         reader.onload = () => {
           this.imageUrl = reader.result as string;
         };
         reader.readAsDataURL(blob);
       },
       error: () => console.error('Failed to load profile image')
     });
   }
 
   logout() {
     this.authService.logout();  }
 
}