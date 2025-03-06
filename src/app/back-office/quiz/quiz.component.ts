import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  newQuiz: any = {
    titre: '',
    description: ''
  };
  selectedCourseId: number | null = null;
  existingQuizzes: any[] = [];
  courseTitle: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isEditing: boolean = false;
  currentQuizId: number | null = null;
  titleError: string = ''; // Message d'erreur pour le titre
  descriptionError: string = ''; // Message d'erreur pour la description

  constructor(
    private quizService: QuizService,
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedCourseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.selectedCourseId) {
      this.loadCourseDetails();
      this.loadQuizzes();
    } else {
      this.errorMessage = 'Aucun ID de cours valide trouvé dans l\'URL';
    }
  }

  loadCourseDetails(): void {
    this.coursesService.getCoursById(this.selectedCourseId!).subscribe({
      next: (cours) => {
        this.courseTitle = cours.titre;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des détails du cours: ' + error.message;
      }
    });
  }

  loadQuizzes(): void {
    this.quizService.getQuizzesByCourse(this.selectedCourseId!).subscribe({
      next: (quizzes) => {
        this.existingQuizzes = quizzes;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des quizzes: ' + error.message;
      }
    });
  }

  editQuiz(quiz: any): void {
    this.isEditing = true;
    this.currentQuizId = quiz.idQuiz;
    this.newQuiz = { ...quiz };
    this.successMessage = '';
    this.errorMessage = '';
    this.validateTitle(); // Valider immédiatement lors de l'édition
    this.validateDescription();
  }

  // Validation du titre
  validateTitle(): boolean {
    const specialCharRegex = /[*<>%]/; // Interdit *, <, >, %
    if (!this.newQuiz.titre || this.newQuiz.titre.trim() === '') {
      this.titleError = 'Le titre est requis.';
      return false;
    } else if (this.newQuiz.titre.trim().length < 2) {
      this.titleError = 'Le titre doit contenir au moins 2 caractères.';
      return false;
    } else if (specialCharRegex.test(this.newQuiz.titre)) {
      this.titleError = 'Le titre ne doit pas contenir les caractères spéciaux *, <, > ou %.';
      return false;
    }
    this.titleError = '';
    return true;
  }

  // Validation de la description
  validateDescription(): boolean {
    const specialCharRegex = /[*<>%]/; // Interdit *, <, >, %
    if (!this.newQuiz.description || this.newQuiz.description.trim() === '') {
      this.descriptionError = 'La description est requise.';
      return false;
    } else if (this.newQuiz.description.trim().length < 10) {
      this.descriptionError = 'La description doit contenir au moins 10 caractères.';
      return false;
    } else if (specialCharRegex.test(this.newQuiz.description)) {
      this.descriptionError = 'La description ne doit pas contenir les caractères spéciaux *, <, > ou %.';
      return false;
    }
    this.descriptionError = '';
    return true;
  }

  onSubmit(): void {
    if (!this.selectedCourseId) {
      this.errorMessage = 'Aucun cours sélectionné';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.titleError = '';
    this.descriptionError = '';

    // Vérifier les validations
    const isTitleValid = this.validateTitle();
    const isDescriptionValid = this.validateDescription();

    if (!isTitleValid || !isDescriptionValid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.currentQuizId) {
      this.quizService.updateQuiz(this.currentQuizId, this.newQuiz).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Quiz modifié avec succès!';
          this.resetForm();
          this.loadQuizzes();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la modification du quiz: ' + error.message;
        }
      });
    } else {
      this.quizService.addQuizToCourse(this.selectedCourseId, this.newQuiz).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Quiz ajouté avec succès!';
          this.resetForm();
          this.loadQuizzes();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de l\'ajout du quiz: ' + error.message;
        }
      });
    }
  }

  deleteQuiz(idQuiz: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce quiz ?')) {
      this.quizService.deleteQuiz(idQuiz).subscribe({
        next: () => {
          this.successMessage = 'Quiz supprimé avec succès!';
          this.loadQuizzes();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du quiz: ' + error.message;
        }
      });
    }
  }

  resetForm(): void {
    this.newQuiz = {
      titre: '',
      description: ''
    };
    this.isEditing = false;
    this.currentQuizId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.titleError = '';
    this.descriptionError = '';
  }

  navigateToAddQuestions(quizId: number): void {
    this.router.navigate(['/questions/add', quizId]);
  }
}