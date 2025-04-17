import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Event as EventModel } from '../models/event';
import { EventsService } from '../services/event.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-event-list',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit, OnDestroy {
  events: EventModel[] = [];
  filteredEvents: EventModel[] = [];
  selectedEvent: EventModel | null = null;
  eventForm: FormGroup;
  editMode = false;
  currentEventId: number | null = null;
  loading = false;
  error: string | null = null;
  showAddForm = false;
  showEvents = true;
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  today: string = new Date().toISOString().split('T')[0];

  // Properties for form inputs
  eventName: string = '';
  location: string = '';
  capacity: number | null = null;
  start_Date: string = this.today;
  end_Date: string = this.today;

  // Filter properties
  searchTerm: string = '';
  selectedLocation: string = '';
  startDateFilter: string = '';
  endDateFilter: string = '';
  private locationSearchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private eventService: EventsService,
    private router: Router,
    private toasterService: ToastrService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      eventName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'-]+$/)
      ]],
      location: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'\-()]+$/)
      ]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      start_Date: ['', Validators.required],
      end_Date: ['', Validators.required],
      image: ['']
    }, { validators: this.dateValidator });
  }

  ngOnInit(): void {
    this.getAllEvents();
    this.locationSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());

    this.eventForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
      this.eventName = values.eventName || '';
      this.location = values.location || '';
      this.capacity = values.capacity || null;
      this.start_Date = values.start_Date || this.today;
      this.end_Date = values.end_Date || this.today;
    });
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
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) 
      return { invalidDates: true };
      
    return startDateObj > endDateObj ? { endDateBeforeStart: true } : null;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      
      console.log('File selected:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select an image file (JPEG, PNG, etc.).';
        this.toasterService.error(this.error, 'Invalid File');
        input.value = '';
        this.selectedFile = null;
        this.photoPreview = null;
        this.eventForm.patchValue({ image: '' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should not exceed 5MB.';
        this.toasterService.error(this.error, 'Invalid File');
        input.value = '';
        this.selectedFile = null;
        this.photoPreview = null;
        this.eventForm.patchValue({ image: '' });
        return;
      }
      
      this.selectedFile = file;
      this.previewFile();
      this.eventForm.patchValue({ image: file });
      this.toasterService.success('Image selected successfully!', 'Success');
    }
  }

  private previewFile(): void {
    if (!this.selectedFile) {
      this.photoPreview = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.photoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  triggerFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  getAllEvents(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = null;

    this.eventService.getAllEvents().pipe(takeUntil(this.destroy$)).subscribe({
      next: (events) => {
        // Convert start_Date and end_Date to Date objects if they are strings
        this.events = events.map(event => ({
          ...event,
          start_Date: new Date(event.start_Date),
          end_Date: new Date(event.end_Date)
        })) || [];
        this.filteredEvents = [...this.events];
        this.loading = false;
        this.toasterService.success('Events loaded successfully!', 'Success');
      },
      error: (err) => this.handleError(err, 'Failed to load events. Please try again.')
    });
  }

  deleteEvent(idEvent: number): void {
    if (this.loading || !confirm('Are you sure you want to delete this event?')) return;
    this.loading = true;

    this.eventService.deleteEvent(idEvent).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.idEvent !== idEvent);
        this.filteredEvents = this.filteredEvents.filter(e => e.idEvent !== idEvent);
        if (this.selectedEvent?.idEvent === idEvent) this.selectedEvent = null;
        this.toasterService.success('Event deleted successfully!', 'Success');
        this.loading = false;
      },
      //error: (err) => this.handleError(err, 'Failed to delete event. Please try again.')
    });
  }

  getEventDetails(idEvent: number): void {
    if (this.loading) return;
    this.loading = true;

    this.eventService.getEventById(idEvent).pipe(takeUntil(this.destroy$)).subscribe({
      next: (event) => {
        // Convert start_Date and end_Date to Date objects if they are strings
        this.selectedEvent = {
          ...event,
          start_Date: new Date(event.start_Date),
          end_Date: new Date(event.end_Date)
        };
        this.loading = false;
        this.toasterService.success(`Details for event "${event.eventName}" loaded successfully!`, 'Success');
      },
      error: (err) => {
        const msg = err.status === 404 ? `Event with ID ${idEvent} not found.` : 'Failed to fetch event details.';
        this.handleError(err, msg);
      }
    });
  }

  editEvent(event: EventModel): void {
    this.editMode = true;
    this.currentEventId = event.idEvent ?? null;
    this.showAddForm = true;
    console.log(event);
    // Format dates for form input
    const startDateFormatted = this.formatDateForInput(new Date(event.start_Date));
    const endDateFormatted = this.formatDateForInput(new Date(event.end_Date));

    // Update form with event data
    this.eventForm.patchValue({
      idEvent: event.idEvent,
      eventName: event.eventName,
      location: event.location,
      capacity: event.capacity,
      start_Date: startDateFormatted,
      end_Date: endDateFormatted,
      imageUrl: event.imageUrl,
      image: ''
    });

    // Update component properties
    this.eventName = event.eventName;
    this.location = event.location;
    this.capacity = event.capacity;
    this.start_Date = startDateFormatted;
    this.end_Date = endDateFormatted;
    
    // Set image preview if available
    if (event.imageUrl) {
      this.photoPreview = event.imageUrl;
    } else {
      this.photoPreview = null;
    }

    this.toasterService.info(`Editing event: ${event.eventName}`, 'Info');
  }

  submitEvent(): void {
    if (this.loading || this.eventForm.invalid) {
      this.markFormGroupTouched(this.eventForm);
      this.toasterService.warning('Please fill out the form correctly.', 'Warning');
      return;
    }

    this.loading = true;

    const formValues = this.eventForm.value;
    
    // Parse dates safely
    let startDate: Date;
    let endDate: Date;
    
    try {
      startDate = new Date(formValues.start_Date);
      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid start date');
      }
    } catch (error) {
      this.toasterService.error('Invalid start date format', 'Error');
      this.loading = false;
      return;
    }
    
    try {
      endDate = new Date(formValues.end_Date);
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid end date');
      }
    } catch (error) {
      this.toasterService.error('Invalid end date format', 'Error');
      this.loading = false;
      return;
    }
    
    // Create event object with proper date formatting
    const eventToSubmit: EventModel = {
      eventName: formValues.eventName,
      location: formValues.location,
      capacity: formValues.capacity,
      start_Date: startDate,
      end_Date: endDate,
      imageUrl: '',
      idEvent: this.editMode && this.currentEventId ? this.currentEventId : 0
    };

    console.log('Submitting event data:', eventToSubmit);

    // First, create or update the event
    if (this.editMode && this.currentEventId) {
      // Update existing event
      this.eventService.updateEvent(this.currentEventId, eventToSubmit).subscribe({
        next: (updatedEvent) => {
          console.log('Event updated successfully:', updatedEvent);
          
          // After event is updated, handle image upload if there's a new image
          if (this.selectedFile) {
            this.uploadEventImage(updatedEvent.idEvent);
          } else {
            this.handleEventUpdateSuccess(updatedEvent);
          }
        },
        error: (err) => this.handleError(err, 'Failed to update event.')
      });
    } else {
      // Create new event
      this.eventService.addEvent(eventToSubmit).subscribe({
        next: (newEvent) => {
          console.log('Event created successfully:', newEvent);
          
          // After event is created, handle image upload if there's an image
          if (this.selectedFile) {
            this.uploadEventImage(newEvent.idEvent);
          } else {
            this.handleEventCreationSuccess(newEvent);
          }
        },
        error: (err) => this.handleError(err, 'Failed to create event.')
      });
    }
  }

  // Method to upload event image after event creation/update
  private uploadEventImage(eventId: number): void {
    if (!this.selectedFile) {
      console.warn('No image selected for upload');
      this.loading = false;
      return;
    }
    
    console.log(`Uploading image for event ID: ${eventId}`);
    console.log(`File: ${this.selectedFile.name} (${this.selectedFile.type}, ${this.selectedFile.size} bytes)`);
    
    // Make sure the eventId is a number
    const idEvent = Number(eventId);
    if (isNaN(idEvent)) {
      console.error('Invalid event ID:', eventId);
      this.toasterService.error('Invalid event ID', 'Error');
      this.loading = false;
      return;
    }
    
    // Display a loading message
    this.toasterService.info('Uploading image...', 'Please wait');
    
    // Upload image with both parameters
    this.eventService.uploadImage(idEvent, this.selectedFile).subscribe({
      next: (response) => {
        // Check if response is a progress event
        if (response && response.progress !== undefined) {
          // Just log progress - could be shown in UI if desired
          console.log(`Upload progress: ${response.progress}%`);
          return; // Don't proceed until we have the final response
        }
        
        console.log('Image upload successful:', response);
        this.toasterService.success('Image uploaded successfully!', 'Success');
        
        // After successful upload, fetch the updated event to get the latest data with imageUrl
        this.eventService.getEventById(idEvent).subscribe({
          next: (updatedEvent) => {
            console.log('Retrieved updated event:', updatedEvent);
            if (this.editMode) {
              this.handleEventUpdateSuccess(updatedEvent);
            } else {
              this.handleEventCreationSuccess(updatedEvent);
            }
          },
          error: (err) => {
            console.error('Error fetching updated event:', err);
            this.toasterService.warning('Image uploaded but failed to fetch updated event details.', 'Warning');
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Image upload error:', err);
        this.error = `Image upload failed: ${err.message || 'The event was saved without an image.'}`;
        this.toasterService.error(this.error, 'Error');
        this.loading = false;
      }
    });
  }

  private handleEventUpdateSuccess(updatedEvent: EventModel): void {
    // Convert dates to Date objects for consistency
    const updatedEventWithDates = {
      ...updatedEvent,
      start_Date: new Date(updatedEvent.start_Date),
      end_Date: new Date(updatedEvent.end_Date)
    };
    
    // Update the events array
    const index = this.events.findIndex(e => e.idEvent === updatedEvent.idEvent);
    if (index !== -1) {
      this.events[index] = updatedEventWithDates;
      this.filteredEvents = [...this.events];
    }
    
    this.toasterService.success(`Event "${updatedEvent.eventName}" updated successfully!`, 'Success');
    this.resetForm();
    this.loading = false;
  }

  private handleEventCreationSuccess(newEvent: EventModel): void {
    // Convert dates to Date objects for consistency
    const newEventWithDates = {
      ...newEvent,
      start_Date: new Date(newEvent.start_Date),
      end_Date: new Date(newEvent.end_Date)
    };
    
    // Add to events array
    this.events.push(newEventWithDates);
    this.filteredEvents = [...this.events];
    this.showAddForm = false;
    
    this.toasterService.success(`Event "${newEvent.eventName}" created successfully!`, 'Success');
    this.resetForm();
    this.loading = false;
  }

  resetForm(): void {
    this.eventForm.reset();
    this.eventName = '';
    this.location = '';
    this.capacity = null;
    this.start_Date = this.today;
    this.end_Date = this.today;
    this.selectedFile = null;
    this.photoPreview = null;
    this.editMode = false;
    this.currentEventId = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.error = null;
    this.showAddForm = false;
    this.toasterService.info('Form reset successfully.', 'Info');
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) this.resetForm();
  }

  displayEvents(): void {
    this.showEvents = !this.showEvents;
    if (this.showEvents) this.getAllEvents();
  }

  onLocationSearch(): void {
    this.locationSearchSubject.next(this.selectedLocation);
  }

  applyFilters(): void {
    const startDateFilter = this.startDateFilter ? new Date(this.startDateFilter) : null;
    const endDateFilter = this.endDateFilter ? new Date(this.endDateFilter) : null;

    this.filteredEvents = this.events.filter(event => {
      const matchesSearchTerm = this.searchTerm.trim()
        ? event.eventName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ');
      const eventLoc = normalize(event.location || '');
      const searchLoc = normalize(this.selectedLocation || '');
      const matchesLocation = searchLoc ? eventLoc.includes(searchLoc) : true;

      const eventStartDate = new Date(event.start_Date);
      const matchesStartDate = startDateFilter && !isNaN(startDateFilter.getTime())
        ? eventStartDate >= startDateFilter
        : true;

      const eventEndDate = new Date(event.end_Date);
      const matchesEndDate = endDateFilter && !isNaN(endDateFilter.getTime())
        ? eventEndDate <= endDateFilter
        : true;

      return matchesSearchTerm && matchesLocation && matchesStartDate && matchesEndDate;
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

  private handleError(err: Error, defaultMsg: string): void {
    console.error('Error:', err);
    this.error = err.message || defaultMsg;
    this.toasterService.error(this.error, 'Error');
    this.loading = false;
  }

  private formatDateForInput(date: Date): string {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date provided to formatDateForInput');
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}