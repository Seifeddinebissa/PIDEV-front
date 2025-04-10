import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Forgot Password</h3>
            </div>
            <div class="card-body">
              <div class="alert alert-success" *ngIf="successMessage">
                {{ successMessage }}
              </div>
              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    [(ngModel)]="email"
                    name="email"
                    required
                  />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Send Reset Link</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthenticationService) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        // Extract the response body (the string message)
        this.successMessage = response.message ;// Use response.body if available, otherwise fallback to response
        this.errorMessage = '';
        console.log(response);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to send reset email. Please try again.';
console.error(error);
        this.successMessage = '';
      }
    });
  }
}
