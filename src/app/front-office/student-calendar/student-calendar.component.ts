import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-student-calendar',
  templateUrl: './student-calendar.component.html',
  styleUrls: ['./student-calendar.component.css']
})
export class StudentCalendarComponent implements OnInit {
  @Input() studentId: number = 123;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  refresh: Subject<any> = new Subject();
  errorMessage: string | null = null;
  isDeleting: boolean = false;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.studentId) {
      this.fetchEvents();
    } else {
      console.error('Student ID is required to fetch events');
    }
  }

  fetchEvents(): void {
    const url = `http://localhost:8081/offres/students/${this.studentId}/events`;

    this.http.get(url).subscribe(
      (response: any) => {
        this.events = response.map((event: any) => ({
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.summary,
          color: { primary: '#1e90ff', secondary: '#D1E8FF' },
          allDay: !event.start.includes('T'),
          meta: {
            location: event.location,
            details: event.description
          },
          id: event.id  // Ensure id is included for each event
        }));
        this.refresh.next(null);
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error fetching events:', error);
        this.errorMessage = 'Failed to fetch events. Please try again later.';
      }
    );
  }

  handleEventClick(event: CalendarEvent): void {
    console.log('Selected event:', event); // ✅ Full object
    console.log('Selected event ID:', event.id); // ✅ Just the ID
    this.selectedEvent = event;
  }

  deleteEvent(calendarEventId: string): void {
    const confirmation = window.confirm('Are you sure you want to delete this event?');
  
    if (!confirmation) {
      return; // If user cancels, do nothing and exit the method
    }
  
    const url = `http://localhost:8081/offres/events/${calendarEventId}`; // URL for deleting the event
  
    this.isDeleting = true;  // Flag to indicate that the request is in progress
  
    // Add `responseType: 'text'` to tell Angular to expect plain text instead of JSON
    this.http.delete(url, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Delete response:', response);  // Log the successful response
        this.events = this.events.filter(event => event.id !== calendarEventId); // Remove the deleted event from the list
        this.selectedEvent = null;
        this.isDeleting = false; // Reset the delete flag
        alert(response);  // Show the success message from the backend
      },
      (error) => {
        console.error('Error deleting event:', error);
        this.isDeleting = false; // Reset the delete flag
        if (error.status === 404) {
          this.errorMessage = 'Event not found. It may have already been deleted.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Failed to delete event. Please try again later.';
        }
      }
    );
  }
  
  
  
  
  
  
  
  
  
}
