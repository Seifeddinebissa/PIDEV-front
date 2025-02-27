import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../services/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  listFeedback: any[] = [];

  constructor(private feedbackService: FeedbackService, private router: Router) { }

  ngOnInit(): void {
    this.feedbackService.getAllFeedbacks().subscribe(data => {
      this.listFeedback = data;
      console.log("Données reçues :", data);
    },
    error => {
      console.error("Erreur de récupération :", error);
    });
  }

  deleteFeedback(id: number, event: Event) {
    event.preventDefault(); // Empêche la redirection
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.deleteFeedback(id).subscribe(() => {
        this.listFeedback = this.listFeedback.filter(f => f.id !== id);
      });
    }
  }

  addFeedback(): void {
    this.router.navigate(['/feedbacks/add']); 
  }
}