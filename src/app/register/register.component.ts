import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userExistsEmail: User | null = null;
  userExistsUsername:  User | null = null;
  username = '';
  password = '';
  firstName = '';
  lastName = '';
  cin = '';
  address = '';
  email = '';
  msg = '';
  image: File | null = null;
  usereExist:boolean = false;
  //roles: string[] = [];
  role: string = 'STUDENT';
  availableRoles = ['STUDENT', 'ADMIN', 'HR', 'TRAINER', 'COMPANY'];

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onFileChange(event: any) {
    this.image = event.target.files[0];
  }
  

  



  onSubmit() {
    // Step 1: Prepare the form data
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('email', this.email);
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('cin', this.cin);
    formData.append('address', this.address);
    if (this.image) {
      formData.append('image', this.image);
    }
    formData.append('roles', this.role);

    // Step 2: Check if username and email already exist
    forkJoin([
      this.authService.existusername(this.username), // Check username
      this.authService.existemail(this.email),       // Check email
    ]).subscribe({
      next: ([usernameResult, emailResult]) => {
        // If either username or email exists, set error message and stop
        if (usernameResult) {
          this.msg = 'Username already exists';
        } else if (emailResult) {
          this.msg = 'Email already exists';
        } else {
          // Step 3: If no conflicts, proceed with registration
          this.authService.register(formData).subscribe({
            next: () => {
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.error('Registration failed', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error checking username/email', err);
        this.msg = 'Error verifying username or email. Please try again.';
      },
    });
  }
}
