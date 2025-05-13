import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../back-office/services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('API Error:', error);
        
        let errorMessage = 'An error occurred';
        const isPublicEndpoint = request.url.includes('/signin') || request.url.includes('/signup');
        const isProfileEndpoint = request.url.includes('/me');

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          console.log('Server-side error:', error.status, error.error);
          
          switch (error.status) {
            case 400:
              errorMessage = this.getErrorMessage(error.error) || 'Bad request';
              break;
            case 401:
              if (!isPublicEndpoint && !isProfileEndpoint) {
                this.authService.logout();
                this.router.navigate(['/login']);
                errorMessage = 'Session expired. Please login again.';
              } else if (isPublicEndpoint) {
                errorMessage = 'Invalid credentials';
              }
              break;
            case 403:
              errorMessage = 'Access denied';
              break;
            case 404:
              errorMessage = this.getErrorMessage(error.error) || 'Resource not found';
              break;
            case 409:
              errorMessage = this.getErrorMessage(error.error) || 'Conflict occurred';
              break;
            case 422:
              errorMessage = this.getErrorMessage(error.error) || 'Validation failed';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = this.getErrorMessage(error.error) || 'Something went wrong';
          }
        }

        // Don't show toastr for authentication endpoints to avoid duplicate messages
        // Also don't show for profile loading errors as they are handled by the auth service
        if (!isPublicEndpoint && !isProfileEndpoint) {
          this.toastr.error(errorMessage, 'Error');
        }

        return throwError(() => ({ error: error.error, message: errorMessage }));
      })
    );
  }

  private getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (Array.isArray(error?.errors)) return error.errors.join('. ');
    return '';
  }
}
