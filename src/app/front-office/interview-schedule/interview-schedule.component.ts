import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../Models/offre.model';
import { OffreService } from '../services/offre.service';

@Component({
  selector: 'app-interview-schedule',
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.css'],
})
export class InterviewScheduleComponent implements OnInit {

    applicationId: number = 0; // Replace with the selected application ID
    interviewDate: string = '';
    interviewLink: string = '';
  
    constructor(private offreService: OffreService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
    scheduleInterview(): void {
      this.offreService.scheduleInterview(this.applicationId, this.interviewDate, this.interviewLink).subscribe(
        response => {
          alert('Interview scheduled successfully!');
        },
        error => {
          console.error('Error scheduling interview:', error);
        }
      );
    }
  }
