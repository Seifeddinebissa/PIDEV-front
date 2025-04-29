import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

interface ForgotPasswordResponse {
  message: string;
}

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
              <form #forgotPasswordForm="ngForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    [(ngModel)]="email"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    [class.is-invalid]="emailInput.invalid && (emailInput.dirty || emailInput.touched)"
                    #emailInput="ngModel"
                  />
                  <div
                    *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)"
                    class="invalid-feedback"
                  >
                    <div *ngIf="emailInput.errors?.['required']">
                      Email is required.
                    </div>
                    <div *ngIf="emailInput.errors?.['pattern']">
                      Please enter a valid email address.
                    </div>
                  </div>
                </div>
                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-warning btn-block rounded-pill"
                    [disabled]="forgotPasswordForm.invalid"
                  >
                    Send Reset Link
                  </button>
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

  constructor(
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    // No need to check form validity here; HTML5 validation will prevent submission if invalid
    this.authService.forgotPassword(this.email).subscribe({
      next: (response: ForgotPasswordResponse) => {
        console.log('Response:', response);
        console.log('Response type:', typeof response);
        console.log('Message:', response.message);
        this.successMessage = response.message;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = error.error?.message || 'Failed to send reset email. Please try again.';
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }
}                     