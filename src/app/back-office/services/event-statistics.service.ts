import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

export interface DashboardStatistics {
  totalEvents: number;
  eventsByLocation: { [location: string]: number };
  eventsPerMonth: { [month: string]: number };
  upcomingEvents: number;
  eventsByCapacity: { [range: string]: number };
  averageEventDuration: number;
  eventsByDayOfWeek: { [day: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class EventStatisticsService {
  private apiUrl = 'http://localhost:8081/GestionEvents/statistics';
  private cachedDashboardStats: Observable<DashboardStatistics> | null = null;
  
  constructor(private http: HttpClient) {}
  
  getDashboardStatistics(): Observable<DashboardStatistics> {
    // Clear cache if it's been more than 5 minutes since last fetch
    this.cachedDashboardStats = this.http.get<DashboardStatistics>(`${this.apiUrl}/dashboard`).pipe(
      tap(stats => console.log('Fetched dashboard statistics:', stats)),
      // Cache the response for 5 minutes
      shareReplay({ bufferSize: 1, refCount: true, windowTime: 5 * 60 * 1000 })
    );
    
    return this.cachedDashboardStats;
  }
  
  getTotalEventCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  
  getEventsByLocation(): Observable<{ [location: string]: number }> {
    return this.http.get<{ [location: string]: number }>(`${this.apiUrl}/by-location`);
  }
  
  getMonthlyDistribution(): Observable<{ [month: string]: number }> {
    return this.http.get<{ [month: string]: number }>(`${this.apiUrl}/monthly`);
  }
  
  getUpcomingEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/upcoming`);
  }
  
  getEventsByCapacity(): Observable<{ [range: string]: number }> {
    return this.http.get<{ [range: string]: number }>(`${this.apiUrl}/by-capacity`);
  }
  
  getAverageEventDuration(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/avg-duration`);
  }
  
  getEventsByDayOfWeek(): Observable<{ [day: string]: number }> {
    return this.http.get<{ [day: string]: number }>(`${this.apiUrl}/by-day`);
  }
  
  clearCache(): void {
    this.cachedDashboardStats = null;
  }
} 