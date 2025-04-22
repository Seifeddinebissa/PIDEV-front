import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

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
