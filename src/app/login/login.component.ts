import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/profile']);
      },
      error: () => console.error('Login failed')
    });
  }
 
}
