 import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Event as EventModel } from '../models/event';
import { EventsService } from '../services/event.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
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
  showAddForm = false;
  showEvents = true;
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  private destroy$ = new Subject<void>();
  filteredEvents: EventModel[] = [];
  eventForm: FormGroup;
  editMode = false;
  currentEventId: number | null = null;
  error: string | null = null;
  today: string = new Date().toISOString().split('T')[0];
  searchTerm: string = '';
  selectedLocation: string = '';
  startDateFilter: string = '';
  endDateFilter: string = '';
  private locationSearchSubject = new Subject<string>();

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private eventService: EventsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toasterService: ToastrService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'-]+$/)]],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'\-()]+$/)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      start_Date: [this.today, Validators.required], // Initialisé à aujourd'hui
      end_Date: ['', Validators.required]
      // Champ 'image' supprimé car non utilisé directement (géré via selectedFile)
    }, { validators: this.dateValidator });
  }

  ngOnInit(): void {
    this.getAllEvents();
    this.locationSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dateValidator(group: FormGroup): ValidationErrors | null {
    const start_Date = group.get('start_Date')?.value;
    const end_Date = group.get('end_Date')?.value;
    if (!start_Date || !end_Date) return null;

    const startDateObj = new Date(start_Date);
    const endDateObj = new Date(end_Date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return { invalidDates: true };
    }
    if (startDateObj < today) {
      return { startDateInPast: true };
    }
    if (startDateObj > endDateObj) {
      return { endDateBeforeStart: true };
    }
    const durationInDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));
    if (durationInDays > 30) {
      return { durationTooLong: true };
    }
    return null;
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

  private resetFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = null;
    this.photoPreview = null;
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement?.click();
  }

  getAllEvents(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = null;

    this.eventService.getAllEvents().pipe(takeUntil(this.destroy$)).subscribe({
      next: (events) => {
        this.events = events.map(event => ({
          ...event,
          start_Date: new Date(event.start_Date),
          end_Date: new Date(event.end_Date)
        }));
        this.applyFilters(); // Applique les filtres immédiatement pour exclure les événements passés
        this.loading = false;
        this.toasterService.success('Events loaded successfully!', 'Success');
      },
      error: (err) => this.handleError(err, 'Failed to load events.')
    });
  }

  deleteEvent(idEvent: number): void {
    if (this.loading || !confirm('Are you sure you want to delete this event?')) return;
    this.loading = true;

    this.eventService.deleteEvent(idEvent).pipe(takeUntil(this.destroy$)).subscribe({
      next: (message) => {
        this.events = this.events.filter(e => e.idEvent !== idEvent);
        this.filteredEvents = this.filteredEvents.filter(e => e.idEvent !== idEvent);
        if (this.selectedEvent?.idEvent === idEvent) this.selectedEvent = null;
        this.toasterService.success(message || 'Event deleted successfully!', 'Success');
        this.loading = false;
      },
      error: (err) => this.handleError(err, 'Failed to delete event.')
    });
  }

  getEventDetails(idEvent: number): void {
    if (this.loading) return;
    this.loading = true;

    this.eventService.getEventById(idEvent).pipe(takeUntil(this.destroy$)).subscribe({
      next: (event) => {
        this.selectedEvent = {
          ...event,
          start_Date: new Date(event.start_Date),
          end_Date: new Date(event.end_Date)
        };
        this.loading = false;
        this.toasterService.success(`Details for event "${event.eventName}" loaded successfully!`, 'Success');
      },
      error: (err) => this.handleError(err, err.status === 404 ? `Event with ID ${idEvent} not found.` : 'Failed to fetch event details.')
    });
  }

  editEvent(event: EventModel): void {
    this.editMode = true;
    this.currentEventId = event.idEvent ?? null;
    this.showAddForm = true;

    this.eventForm.patchValue({
      eventName: event.eventName,
      location: event.location,
      capacity: event.capacity,
      start_Date: this.formatDateForInput(new Date(event.start_Date)),
      end_Date: this.formatDateForInput(new Date(event.end_Date))
    });

    this.photoPreview = event.imageUrl || null;
    this.toasterService.info(`Editing event: ${event.eventName}`, 'Info');
  }

  private handleEventSuccess(event: EventModel, isUpdate: boolean): void {
    const eventWithDates = {
      ...event,
      start_Date: new Date(event.start_Date),
      end_Date: new Date(event.end_Date)
    };

    if (isUpdate) {
      const index = this.events.findIndex(e => e.idEvent === event.idEvent);
      if (index !== -1) {
        this.events[index] = eventWithDates;
      }
    } else {
      this.events.push(eventWithDates);
      this.showAddForm = false;
    }

    this.applyFilters(); // Réapplique les filtres pour exclure les événements passés
    this.toasterService.success(`Event "${event.eventName}" ${isUpdate ? 'updated' : 'created'} successfully!`, 'Success');
    this.resetForm();
    this.loading = false;
  }

  private handleImageUpload(idEvent: number, isUpdate: boolean): void {
    if (!this.selectedFile) {
      this.loading = false;
      return;
    }

    this.toasterService.info('Uploading image...', 'Please wait');

    this.eventService.uploadImage(this.selectedFile).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: { imageUrl: string }) => {
        if (!response?.imageUrl) {
          this.handleError(new Error('No image URL received from server'));
          return;
        }

        this.toasterService.success('Image uploaded successfully!', 'Success');
        const eventToUpdate = {
          ...this.eventForm.value,
          idEvent,
          imageUrl: response.imageUrl
        };

        if (isUpdate) {
          this.eventService.updateEvent(idEvent, eventToUpdate)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedEvent) => this.handleEventSuccess(updatedEvent, true),
              error: (err) => this.handleError(err, 'Failed to update event with new image.')
            });
        } else {
          this.handleEventSuccess(eventToUpdate, false);
        }
      },
      error: (err) => {
        this.error = `Image upload failed: ${err.message || 'The event was saved without an image.'}`;
        this.toasterService.error(this.error, 'Error');
        this.loading = false;
      }
    });
  }

  submitEvent(): void {
    if (!this.eventForm.valid) {
      this.markFormGroupTouched(this.eventForm);
      this.toasterService.error('Please fill in all fields correctly', 'Validation Error');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.eventForm.value;
      const startDate = new Date(formValue.start_Date);
      const endDate = new Date(formValue.end_Date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const eventToSubmit: EventModel = {
        eventName: formValue.eventName,
        location: formValue.location,
        capacity: formValue.capacity,
        start_Date: startDate,
        end_Date: endDate,
        imageUrl: this.editMode ? this.photoPreview || '' : '', // Conserve l'image existante en mode édition
        idEvent: this.editMode && this.currentEventId ? this.currentEventId : 0
      };

      if (this.selectedFile) {
        this.eventService.uploadImage(this.selectedFile)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              eventToSubmit.imageUrl = response.imageUrl;
              this.addEvent(eventToSubmit);
            },
            error: (err: any) => {
              console.error('Error uploading image:', err);
              this.error = 'Failed to upload image. Event will be created without image.';
              this.toasterService.warning(this.error, 'Image Upload Failed');
              eventToSubmit.imageUrl = '';
              this.addEvent(eventToSubmit);
            }
          });
      } else {
        eventToSubmit.imageUrl = '';
        this.addEvent(eventToSubmit);
      }
    } catch (error) {
      this.toasterService.error(error instanceof Error ? error.message : 'Invalid date format', 'Error');
      this.loading = false;
    }
  }

  resetForm(): void {
    this.eventForm.reset({
      start_Date: this.today
    });
    this.selectedFile = null;
    this.photoPreview = null;
    this.editMode = false;
    this.currentEventId = null;
    this.resetFileInput();
    this.error = null;
    this.showAddForm = false;
    this.toasterService.info('Form reset successfully.', 'Info');
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

  onLocationSearch(): void {
    this.locationSearchSubject.next(this.selectedLocation);
  }

  applyFilters(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDateFilter = this.startDateFilter ? new Date(this.startDateFilter) : today;
    const endDateFilter = this.endDateFilter ? new Date(this.endDateFilter) : null;

    this.filteredEvents = this.events.filter(event => {
      const matchesSearchTerm = this.searchTerm.trim()
        ? (event.eventName?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
          (event.location?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())
        : true;

      const normalize = (s: string | null | undefined) => (s || '').toLowerCase().trim().replace(/\s+/g, ' ');
      const matchesLocation = this.selectedLocation ? normalize(event.location).includes(normalize(this.selectedLocation)) : true;

      const eventStartDate = new Date(event.start_Date);
      const eventEndDate = new Date(event.end_Date);
      const matchesStartDate = !isNaN(startDateFilter.getTime()) ? eventStartDate >= startDateFilter : true;
      const matchesEndDate = endDateFilter && !isNaN(endDateFilter.getTime()) ? eventEndDate <= endDateFilter : true;

      const isNotPast = eventStartDate >= today;

      return matchesSearchTerm && matchesLocation && matchesStartDate && matchesEndDate && isNotPast;
    });
    this.toasterService.info('Filters applied successfully.', 'Info');
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedLocation = '';
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyFilters();
    this.toasterService.info('Filters cleared successfully.', 'Info');
  }

  private handleError(error: any, customMessage?: string): void {
    this.loading = false;
    const errorMessage = customMessage || error.message || 'An error occurred';
    const finalMessage = errorMessage.includes('log in')
      ? 'Please log in to perform this action.'
      : errorMessage.includes('404')
        ? 'The requested resource was not found. Please check the URL.'
        : errorMessage;

    this.toasterService.error(finalMessage, 'Error');
  }

  private formatDateForInput(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Invalid date provided to formatDateForInput');
    return date.toISOString().split('T')[0];
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) this.markFormGroupTouched(control);
    });
  }

  private addEvent(event: EventModel): void {
    this.eventService.addEvent(event).pipe(takeUntil(this.destroy$)).subscribe({
      next: (newEvent) => {
        this.handleEventSuccess(newEvent, false);
      },
      error: (err) => {
        this.handleError(err, 'Failed to create event.');
      }
    });
  }
}