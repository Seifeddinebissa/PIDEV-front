import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../../back-office/services/event.service';
import { Event as EventModel } from '../../back-office/models/event';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  events: EventModel[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  uploadProgress: number = 0;

  constructor(
    private eventService: EventsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async uploadImage(event: any, eventId?: number): Promise<void> {
    const file = event.target.files[0];
    if (!file) {
      this.error = 'No file selected';
      return;
    }

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
      this.error = 'Invalid file type. Please upload an image file (JPEG, PNG, JPG, or GIF)';
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.error = 'File size too large. Maximum size is 5MB';
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      const response = await this.eventService.uploadImage(file)
        .pipe(takeUntil(this.destroy$))
        .toPromise();
        
      if (response && response.imageUrl) {
        // If we have an event ID, we could update the event with the new image URL here
        this.loading = false;
        return;
      }
    } catch (err: any) {
      this.error = err.message || 'Failed to upload image';
      console.error('Error uploading image:', err);
    } finally {
      this.loading = false;
    }
  }

  loadEvents() {
    this.loading = true;
    this.error = null;

    this.eventService.getAllEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          this.events = events.map(event => ({
            ...event,
            start_Date: new Date(event.start_Date),
            end_Date: new Date(event.end_Date)
          }));
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load events. Please try again later.';
          this.loading = false;
          console.error('Error loading events:', error);
        }
      });
  }

  getImageUrl(imageName: string | null | undefined): string {
    if (!imageName) return 'assets/images/default-event.jpg';
    if (imageName.startsWith('http')) return imageName; // If it's already a full URL
    return `http://localhost:8081/GestionEvents/images/${imageName}`;
  }

  viewEventDetails(eventId: number) {
    this.router.navigate(['/event-details', eventId]);
  }
}
