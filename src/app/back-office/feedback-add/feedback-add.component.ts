import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';
import { FormationService } from '../services/formation.service';

@Component({
  selector: 'app-feedback-add',
  templateUrl: './feedback-add.component.html',
  styleUrls: ['./feedback-add.component.css']
})
export class FeedbackAddComponent implements OnInit {
  feedbackForm!: FormGroup;
  formations: any[] = [];
  userId: number = 1; // Hardcoded for now; replace with authenticated user ID if available

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private feedbackService: FeedbackService,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getFormations();
  }

  initForm() {
    this.feedbackForm = this.fb.group({
      comment: ['', [Validators.required]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      formationId: [null, [Validators.required]],
      date: ['', [Validators.required]]
    });
  }

  getFormations() {
    this.formationService.getAllFormation().subscribe(
      (response) => {
        this.formations = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des formations:', error);
      }
    );
  }

  addFeedback() {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      console.log('Formulaire invalide:', this.feedbackForm.value);
      return;
    }

    const feedbackData = this.feedbackForm.value;
    console.log('Données du feedback:', feedbackData);

    // Pass userId to addFeedback
    this.feedbackService.addFeedback(feedbackData, feedbackData.formationId, this.userId).subscribe(
      (response) => {
        console.log('Feedback ajouté avec succès:', response);
        this.router.navigate(['/feedbacks']);
      },
      (error) => {
        console.error('Erreur lors de l’ajout du feedback:', error);
      }
    );
  }
}