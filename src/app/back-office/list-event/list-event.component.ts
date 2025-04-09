import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { EventsService } from '../services/event.service';
import { Event as EventModel } from '../models/event';
import { Subject, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-list',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit, OnDestroy {
  events: EventModel[] = [];
  newEvent: any = {};
  selectedEvent: EventModel | null = null;
  loading = false;
  error: string | undefined = undefined;
  showAddForm = false;
  showEvents = true;
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  today: string;
  private destroy$ = new Subject<void>();

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private eventService: EventsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toasterService: ToastrService
  ) {
    this.today = new Date().toISOString().split('T')[0];
    this.resetForm();
  }

  ngOnInit(): void {
    this.getAllEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.previewFile();
      } else {
        this.error = 'Please select an image file.';
        this.toasterService.error(this.error, 'Invalid File');
        input.value = '';
        this.selectedFile = null;
        this.photoPreview = null;
      }
    }
  }

  private previewFile(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.photoPreview = e.target?.result as string || null;
      this.cdr.detectChanges(); // Cet appel est correct ici car il est synchrone
    };
    reader.readAsDataURL(this.selectedFile);
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  getAllEvents(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = undefined;

    this.eventService.getAllEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          this.events = events || [];
          this.error = undefined;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Failed to load events:', err);
          this.error = err.message || 'Failed to load events. Please try again.';
          this.toasterService.error(this.error, 'Error');
          this.events = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  deleteEvent(idEvent: number): void {
    if (this.loading) return;
    if (!confirm('Are you sure you want to delete this event?')) return;

    this.loading = true;
    this.error = undefined;

    this.eventService.deleteEvent(idEvent)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.events = this.events.filter(event => event.idEvent !== idEvent);
          if (this.selectedEvent?.idEvent === idEvent) {
            this.selectedEvent = null;
          }
          this.error = undefined;
          this.loading = false;
          this.toasterService.success('Event deleted successfully!', 'Success');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error deleting event:', err);
          this.error = err.message || 'Failed to delete event. Please try again.';
          this.toasterService.error(this.error, 'Error');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  getEventDetails(idEvent: number): void {
    if (this.loading) return;

    this.loading = true;
    this.error = undefined;

    this.eventService.getEventById(idEvent)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => {
          this.selectedEvent = event;
          this.error = undefined;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error fetching event details:', err);
          this.error = err.status === 404 
            ? `Event with ID ${idEvent} not found.` 
            : err.message || 'Failed to fetch event details. Please try again.';
          this.toasterService.error(this.error, 'Error');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  submitEvent(): void {
    if (this.loading) return;

    if (!this.validateDates()) {
      this.error = 'End date must be after or equal to start date.';
      this.toasterService.warning(this.error, 'Invalid Dates');
      return;
    }

    this.loading = true;
    this.error = undefined;

    const eventToSubmit: EventModel = {
      ...this.newEvent,
      start_Date: this.newEvent.start_Date ? new Date(this.newEvent.start_Date) : new Date(),
      end_Date: this.newEvent.end_Date ? new Date(this.newEvent.end_Date) : new Date(),
      imageUrl: ''
    };

    if (this.selectedFile) {
      this.eventService.uploadImage(this.selectedFile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            eventToSubmit.imageUrl = response.imageUrl;
            this.createEvent(eventToSubmit);
          },
          error: (err: any) => {
            console.error('Error uploading image:', err);
            this.error = 'Failed to upload image. Event will be created without image.';
            this.toasterService.warning(this.error, 'Image Upload Failed');
            eventToSubmit.imageUrl = '';
            this.createEvent(eventToSubmit);
          }
        });
    } else {
      eventToSubmit.imageUrl = '';
      this.createEvent(eventToSubmit);
    }
  }

  private createEvent(event: EventModel): void {
    console.log('Event envoyé au serveur :', event);
    this.eventService.addEvent(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Réponse du serveur :', response);
          this.events.push(response);
          this.showAddForm = false;
          this.resetForm();
          this.error = undefined;
          this.loading = false;
          this.toasterService.success('Event created successfully!', 'Success');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Erreur lors de l\'ajout :', err);
          this.error = err.error?.message || err.message || 'Failed to add event.';
          this.toasterService.error(this.error, 'Error');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  resetForm(): void {
    this.newEvent = {
      eventName: '',
      location: '',
      capacity: 0,
      start_Date: this.today,
      end_Date: this.today,
      imageUrl: ''
    };
    this.selectedFile = null;
    this.photoPreview = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.error = undefined;
    // Suppression de l'appel à this.cdr.detectChanges() ici
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  displayEvents(): void {
    this.showEvents = !this.showEvents;
    if (this.showEvents) {
      this.getAllEvents();
    }
  }

  validateDates(): boolean {
    const start = new Date(this.newEvent.start_Date);
    const end = new Date(this.newEvent.end_Date);
    return start <= end && !isNaN(start.getTime()) && !isNaN(end.getTime());
  }
}