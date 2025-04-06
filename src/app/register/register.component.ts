import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  username = '';
  password = '';
  email = '';
  image: File | null = null;
  //roles: string[] = [];
  role: string = 'STUDENT';
  availableRoles = ['STUDENT', 'ADMIN', 'HR', 'TRAINER', 'COMPANY'];

  constructor(private authService: AuthenticationService, private router: Router) {}

  onFileChange(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('email', this.email);
    if (this.image) {
      formData.append('image', this.image);
    }
    //formData.append('roles', this.roles.join(','));
    formData.append('roles', this.role);

    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigate(['/login'])
      },
      error: (err) => console.error('Registration failed', err)
    });
  }
}
