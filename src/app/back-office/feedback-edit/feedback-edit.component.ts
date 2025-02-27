import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';
import { Feedback } from '../models/Feedback';

@Component({
  selector: 'app-feedback-edit',
  templateUrl: './feedback-edit.component.html',
  styleUrls: ['./feedback-edit.component.css']
})
export class FeedbackEditComponent implements OnInit {

  feedbackForm!: FormGroup;
  feedbackId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Récupération de l'ID depuis l'URL
    this.feedbackId = +this.route.snapshot.paramMap.get('id')!;
    if (this.feedbackId) {
      this.feedbackService.getFeedbackById(this.feedbackId).subscribe(
        (data) => {
          this.feedbackForm.patchValue({
            comment: data.comment,
            rating: data.rating,
            date: data.date
          });
        },
        (error) => {
          console.error('Erreur lors du chargement du feedback:', error);
        }
      );
    }
  }

  // Initialisation du formulaire avec validation
  initForm() {
    this.feedbackForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(5)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      date: ['', [Validators.required]]
    });
  }

  // Mise à jour du feedback
  updateFeedback(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      console.log('Formulaire invalide:', this.feedbackForm.value);
      return;
    }

    const updatedFeedback: Feedback = {
      id: this.feedbackId,
      ...this.feedbackForm.value
    };

    this.feedbackService.updateFeedback(this.feedbackId, updatedFeedback).subscribe(
      () => {
        console.log('Feedback mis à jour avec succès:', updatedFeedback);
        this.router.navigate(['/feedbacks']); // Redirection après mise à jour
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du feedback:', error);
      }
    );
  }
}