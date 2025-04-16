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

   user: User | null = null;
   imageUrl: string | null = null;
 
   constructor(private authService: AuthenticationService) {}
 
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
     this.authService.logout();
   }
 
}
