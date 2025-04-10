import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Reset Password</h3>
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
                  <label for="newPassword" class="form-label">New Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="newPassword"
                    [(ngModel)]="newPassword"
                    name="newPassword"
                    required
                  />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Reset Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Get the token from the URL query parameter
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMessage = 'Invalid or missing token';
      }
    });
  }

  onSubmit() {
    if (!this.token) {
      this.errorMessage = 'Invalid or missing token';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        // Redirect to login page after a short delay
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to reset password. Please try again.';
        this.successMessage = '';
      }
    });
  }
}
