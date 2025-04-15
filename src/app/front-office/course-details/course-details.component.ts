import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormationService } from '../../back-office/services/formation.service';
import { Formation } from './../../back-office/models/Formation';
import { FeedbackService } from '../../back-office/services/feedback.service';
import { Feedback } from '../../back-office/models/Feedback';
import { OpenLibraryService } from '../../back-office/services/open-library.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  formation: Formation | undefined;
  feedbacks: Feedback[] = [];
  feedbackCount: number = 0;
  averageRating: number = 0;
  ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedbackForm: FormGroup;
  books: any[] = [];

  // Liste des mots interdits (tu peux la personnaliser)
  private badWords: string[] = ['hello', 'hate'];

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private feedbackService: FeedbackService,
    private fb: FormBuilder,
    private openLibraryService: OpenLibraryService
  ) {
    this.feedbackForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, this.mustContainLetter(), this.noBadWords(this.badWords)]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      console.error('ID de formation invalide');
      return;
    }

    this.formationService.getFormationById(id).subscribe(
      (formation: Formation) => {
        this.formation = formation;
        this.loadFeedbackDetails(id);
        this.loadRecommendedBooks(formation.title);
      },
      (error) => {
        console.error('Erreur lors du chargement de la formation:', error);
      }
    );
  }

  private loadRecommendedBooks(title: string): void {
    this.openLibraryService.getBooks(title).subscribe(
      (response) => {
        this.books = response.docs.slice(0, 3);
      },
      (error) => {
        console.error(`Erreur lors du chargement des livres pour ${title}`, error);
        this.books = [];
      }
    );
  }

  getBookCoverUrl(coverId: number | undefined): string {
    return this.openLibraryService.getCoverUrl(coverId);
  }

  private loadFeedbackDetails(formation_id: number): void {
    this.formationService.getFeedbackCountByFormation(formation_id).subscribe(
      (count: number) => {
        this.feedbackCount = count;
      },
      (error) => {
        console.error(`Erreur lors du chargement du nombre de feedbacks pour la formation ${formation_id}:`, error);
      }
    );

    this.formationService.getFeedbacksByFormation(formation_id).subscribe(
      (feedbacks: Feedback[]) => {
        this.feedbacks = feedbacks;
        this.calculateAverageRating(feedbacks);
        this.calculateRatingDistribution(feedbacks);
      },
      (error) => {
        console.error(`Erreur lors du chargement des feedbacks pour la formation ${formation_id}:`, error);
      }
    );
  }

  private calculateAverageRating(feedbacks: Feedback[]): void {
    if (!feedbacks || feedbacks.length === 0) {
      this.averageRating = 0;
      return;
    }
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    this.averageRating = parseFloat((totalRating / feedbacks.length).toFixed(2));
  }

  private calculateRatingDistribution(feedbacks: Feedback[]): void {
    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(feedback => {
      if (feedback.rating >= 1 && feedback.rating <= 5) {
        this.ratingDistribution[feedback.rating]++;
      }
    });
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid) {
      console.error('Formulaire invalide');
      return;
    }
    
    const newFeedback: Feedback = {
      id: 0,
      rating: this.feedbackForm.value.rating,
      comment: this.feedbackForm.value.comment,
      date: new Date(),
      formation_id: Number(this.route.snapshot.paramMap.get('id'))
    };

    this.feedbackService.addFeedback(newFeedback, newFeedback.formation_id).subscribe(
      (response) => {
        console.log('Feedback ajouté avec succès', response);
        this.feedbacks.push(response);
        this.calculateAverageRating(this.feedbacks);
        this.calculateRatingDistribution(this.feedbacks);
        this.feedbackForm.reset();
      },
      (error) => {
        console.error('Erreur lors de l’ajout du feedback:', error);
      }
    );
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/courses/default.jpg';
    console.warn('Image failed to load, using default image');
  }

  // Validateur pour vérifier qu’il y a au moins une lettre
  mustContainLetter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasLetter = /[a-zA-Z]/.test(value);
      return hasLetter ? null : { noLetter: { value: control.value } };
    };
  }

  // Nouveau validateur pour détecter les mauvais mots
  noBadWords(badWords: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null; // Laisser Validators.required gérer le cas vide
      }
      const lowerCaseValue = value.toLowerCase();
      const foundBadWord = badWords.find(badWord => lowerCaseValue.includes(badWord.toLowerCase()));
      return foundBadWord ? { badWord: { value: control.value, word: foundBadWord } } : null;
    };
  }
}