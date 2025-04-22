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
  filteredFeedback: any[] = []; // To handle filtering if added later
  paginatedFeedback: any[] = []; // List for paginated items

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 6; // 5 items per page, adjustable
  totalItems: number = 0; // Total number of items after filtering

  constructor(private feedbackService: FeedbackService, private router: Router) {}

  ngOnInit(): void {
    this.feedbackService.getAllFeedbacks().subscribe(
      data => {
        this.listFeedback = data;
        this.filteredFeedback = data; // Initially, no filtering
        this.totalItems = this.filteredFeedback.length;
        this.updatePaginatedFeedback();
        console.log("Données reçues :", data);
      },
      error => {
        console.error("Erreur de récupération :", error);
      }
    );
  }

  deleteFeedback(id: number, event: Event) {
    event.preventDefault(); // Empêche la redirection
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.deleteFeedback(id).subscribe(() => {
        this.listFeedback = this.listFeedback.filter(f => f.id !== id);
        this.filteredFeedback = this.filteredFeedback.filter(f => f.id !== id);
        this.totalItems = this.filteredFeedback.length;
        this.updatePaginatedFeedback();
      });
    }
  }

  addFeedback(): void {
    this.router.navigate(['/feedbacks/add']);
  }

  toggleHidden(feedback: any, event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior
    const newHiddenStatus = !feedback.is_hidden;

    // Update the feedback object locally first for instant UI feedback
    feedback.is_hidden = newHiddenStatus;

    // Send update to backend
    this.feedbackService.updateFeedback(feedback.id, feedback).subscribe(
      (updatedFeedback) => {
        console.log('Feedback hidden status updated:', updatedFeedback);
        // Ensure local state matches backend response
        feedback.is_hidden = updatedFeedback.is_hidden;
      },
      (error) => {
        // Revert on error
        feedback.is_hidden = !newHiddenStatus;
        console.error('Error toggling hidden status:', error);
      }
    );
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedFeedback();
    }
  }

  updatePaginatedFeedback(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFeedback = this.filteredFeedback.slice(startIndex, endIndex);
  }
}