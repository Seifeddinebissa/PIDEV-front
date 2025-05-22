import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../back-office/services/event.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe]
})
export class ViewEventsComponent implements OnInit {
  events: any[] = [];

  constructor(private datePipe: DatePipe, 
    private eventService: EventsService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'fullDate') || '';
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (data) => { this.events = data; },
      (error) => { console.error('Erreur lors du chargement des événements', error); }
    );
  }
}