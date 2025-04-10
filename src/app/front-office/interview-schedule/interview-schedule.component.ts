import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interview-schedule',
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.css'],
})
export class InterviewScheduleComponent implements OnInit {
  interview: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const interviewUrlId = this.route.snapshot.paramMap.get('id');
    if (interviewUrlId) {
      this.loadInterviewDetails(interviewUrlId);
    } else {
      this.error = 'Invalid interview URL';
      this.loading = false;
    }
  }

  loadInterviewDetails(interviewUrlId: string): void {
    this.http.get<any>(`http://localhost:8081/api/interviews/${interviewUrlId}`).subscribe({
      next: (interview) => {
        this.interview = interview;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading interview:', err);
        this.error = 'Failed to load interview details';
        this.loading = false;
      },
    });
  }

  joinInterview(): void {
    window.open(this.interview.interviewUrl, '_blank');
  }
}