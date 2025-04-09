import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Event } from 'src/app/back-office/models/event';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from 'src/app/back-office/services/event.service';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  event: Event | null = null;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getEventDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getEventDetails(): void {
    const idEvent = this.route.snapshot.paramMap.get('id');
    if (!idEvent) {
      this.error = 'Event ID not provided.';
      this.toasterService.error(this.error ?? undefined, 'Error');
      this.router.navigate(['/events']);
      return;
    }

    this.loading = true;
    this.error = null;

    this.eventsService.getEventById(+idEvent)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => {
          this.event = event;
          this.error = null;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error fetching event details:', err);
          this.error = err.status === 404 
            ? `Event with ID ${idEvent} not found.` 
            : err.message || 'Failed to fetch event details. Please try again.';
          this.toasterService.error(this.error ?? undefined, 'Error');
          this.loading = false;
          this.router.navigate(['/events']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}