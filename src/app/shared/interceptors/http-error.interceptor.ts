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
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private publicEndpoints = [
    '/login',
    '/register',
    '/exist-username',
    '/exist-email',
    '/forgot-password',
    '/reset-password'
  ];

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if this is a public endpoint
        const isPublicEndpoint = this.publicEndpoints.some(endpoint => 
          request.url.includes(endpoint)
        );

        // Log error details for debugging
        console.error('API Error:', {
          url: request.url,
          method: request.method,
          status: error.status,
          statusText: error.statusText,
          isPublicEndpoint,
          headers: request.headers.keys().map(key => `${key}: ${request.headers.get(key)}`),
          error: error.error
        });

        // Handle connection errors (status 0)
        if (error.status === 0) {
          console.error('Connection error - Backend server may be down or unreachable');
          return throwError(() => new Error('Unable to connect to server. Please check your connection and try again.'));
        }

        // Handle authentication errors only for protected endpoints
        if (!isPublicEndpoint && (error.status === 401 || error.status === 403)) {
          console.log('Authentication required for protected endpoint:', request.url);
          return throwError(() => new Error('Authentication required. Please log in.'));
        }

        // For public endpoints with 401/403, just return the error without redirecting
        if (isPublicEndpoint && (error.status === 401 || error.status === 403)) {
          console.log('Public endpoint error:', request.url);
          return throwError(() => new Error(error.error?.message || 'Request failed'));
        }

        // Handle client-side errors
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
          return throwError(() => new Error(error.error.message));
        }

        // Handle server-side errors
        console.error('Server-side error:', error.status, error.error);
        const message = error.error?.message || error.message || 'An unknown error occurred';
        return throwError(() => new Error(message));
      })
    );
  }
}