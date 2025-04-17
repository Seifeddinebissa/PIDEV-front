import { Component, OnInit } from '@angular/core';
import { OffreService } from '../services/offre.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  applications: any[] = [];
  appointments: any[] = [];
  studentId: number = 123; // Replace with the logged-in student's ID

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    // Fetch applications
    this.offreService.getApplications(this.studentId).subscribe(
      data => {
        this.applications = data;
      },
      error => {
        console.error('Error fetching applications:', error);
      }
    );

    // Fetch appointments
    this.offreService.getAppointmentsByStudentId(this.studentId).subscribe(
      data => {
        this.appointments = data;
      },
      error => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
}