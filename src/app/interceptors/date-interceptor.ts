import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only process POST and PUT requests that might contain date fields
    if (request.method === 'POST' || request.method === 'PUT') {
      // Clone the request body and transform date fields
      const body = request.body;
      if (body) {
        const transformedBody = this.transformDates(body);
        
        // Clone the request with the transformed body
        request = request.clone({ body: transformedBody });
      }
    }
    return next.handle(request);
  }
  /**
   * Recursively transforms Date objects to ISO strings with proper time component
   */
  private transformDates(body: any): any {
    if (!body) {return body; }
   if (Array.isArray(body)) {
      return body.map(item => this.transformDates(item));}
    if (typeof body === 'object') {
      const transformed = { ...body };  
      Object.keys(transformed).forEach(key => {const value = transformed[key];
        
        // If it's a Date object, convert to ISO string
        if (value instanceof Date) { transformed[key] = value.toISOString(); } 
        // If it's a string that looks like a date in YYYY-MM-DD format, add time component
        else if (typeof value === 'string' && 
                /^\d{4}-\d{2}-\d{2}$/.test(value) && 
                !isNaN(Date.parse(value))) {
          transformed[key] = new Date(value + 'T00:00:00').toISOString(); }
        // If it's an object, recurse
        else if (typeof value === 'object' && value !== null) {
          transformed[key] = this.transformDates(value);  }
      });
      return transformed;  }
    return body; }
} 