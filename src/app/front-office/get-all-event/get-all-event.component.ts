import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/back-office/services/event.service';
import { Event } from 'src/app/back-office/models/event';
import { FavoriteService } from '../services/favorite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-get-all-event',
  templateUrl: './get-all-event.component.html',
  styleUrls: ['./get-all-event.component.css']
})
export class GetAllEventComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  loading = false;
  error: string | null = null;
  showEvents = false; // Controls visibility of event list
  today: string;
  private destroy$ = new Subject<void>();
 

  constructor(
    private eventService: EventsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private favoriteService: FavoriteService,
    private toastr: ToastrService
  ) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.getAllEvents(); // Fetch events on initialization
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllEvents(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = null;

    this.eventService.getAllEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          this.events = events || [];
          this.error = null;
          this.loading = false;
          this.showEvents = true; // Show events after fetching
          this.cdr.detectChanges(); // Ensure UI updates
        },
        error: (err) => {
          console.error('Failed to load events:', err);
          this.error = err.message || 'Failed to load events. Please try again.';
          this.events = [];
          this.loading = false;
          this.showEvents = true; // Still show (empty) list with error
        }
      });
  }

  displayEvents(): void {
    this.showEvents = !this.showEvents;
    if (this.showEvents && !this.events.length) {
      this.getAllEvents(); // Fetch events only if not already loaded
    }
  }

  viewEventDetails(idEvent: number): void {
    this.router.navigate(['/events', idEvent]);
  }

  toggleFavorite(event: Event): void {
    if (this.favoriteService.isFavorite(event.idEvent)) {
      this.favoriteService.removeFromFavorites(event.idEvent);
      this.toastr.success('Event removed from favorites', 'Success');
    } else {
      this.favoriteService.addToFavorites(event);
      this.toastr.success('Event added to favorites', 'Success');
    }
  }

  isFavorite(idEvent: number): boolean {
    return this.favoriteService.isFavorite(idEvent);
  }
}