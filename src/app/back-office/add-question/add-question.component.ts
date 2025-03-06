import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { ReponseService } from '../services/reponse.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface Reponse {
  idReponse?: number;
  contenu: string;
  isCorrect: boolean;
  answernum: string; // "A", "B", "C", "D"
  questionId?: number;
}

export interface Question {
  idQuestion?: number;
  contenu: string;
  score: number;
  correctAnswer: string;
  quizId?: number;
  reponses: Reponse[];
}

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  quizId: number | null = null;
  newQuestion: Question = {
    contenu: '',
    score: 0,
    correctAnswer: '',
    reponses: [
      { contenu: '', isCorrect: false, answernum: 'A' },
      { contenu: '', isCorrect: false, answernum: 'B' },
      { contenu: '', isCorrect: false, answernum: 'C' },
      { contenu: '', isCorrect: false, answernum: 'D' }
    ]
  };
  existingQuestions: Question[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isEditing: boolean = false;
  currentQuestionId: number | null = null;

  constructor(
    private questionService: QuestionService,
    private reponseService: ReponseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    if (!this.quizId) {
      this.errorMessage = 'Aucun ID de quiz valide trouvé dans l\'URL';
      console.error(this.errorMessage);
    } else {
      console.log('Quiz ID récupéré:', this.quizId);
      this.loadQuestions();
    }
  }

  loadQuestions(): void {
    if (this.quizId) {
      this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
        next: (questions: Question[]) => {
          this.existingQuestions = questions || [];
          console.log('Questions chargées avec succès:', this.existingQuestions);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors du chargement des questions: ' + error.message;
          this.existingQuestions = [];
          console.error('Erreur:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return (
      !!this.newQuestion.contenu &&
      this.newQuestion.score > 0 &&
      this.newQuestion.reponses.every(r => !!r.contenu) &&
      this.newQuestion.reponses.some(r => r.isCorrect)
    );
  }

  setCorrectAnswer(index: number): void {
    this.newQuestion.reponses.forEach((r, i) => {
      r.isCorrect = i === index;
      if (r.isCorrect) {
        this.newQuestion.correctAnswer = r.answernum;
      }
    });
    console.log('Réponse correcte définie:', this.newQuestion.correctAnswer);
  }

  editQuestion(question: Question): void {
    this.isEditing = true;
    this.currentQuestionId = question.idQuestion || null;
    this.newQuestion = { ...question }; // Copie la question

    // Charger les réponses associées
    if (this.currentQuestionId) {
      this.reponseService.getReponsesByQuestionId(this.currentQuestionId).subscribe({
        next: (reponses: Reponse[]) => {
          // Assurer que les réponses sont au format attendu (A, B, C, D)
          const updatedReponses = [
            { contenu: '', isCorrect: false, answernum: 'A' },
            { contenu: '', isCorrect: false, answernum: 'B' },
            { contenu: '', isCorrect: false, answernum: 'C' },
            { contenu: '', isCorrect: false, answernum: 'D' }
          ];
          reponses.forEach(r => {
            const index = ['A', 'B', 'C', 'D'].indexOf(r.answernum);
            if (index !== -1) {
              updatedReponses[index] = { ...r };
            }
          });
          this.newQuestion.reponses = updatedReponses;
          console.log('Réponses chargées pour modification:', this.newQuestion.reponses);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors du chargement des réponses: ' + error.message;
          console.error('Erreur:', error);
        }
      });
    }

    this.successMessage = '';
    this.errorMessage = '';
    console.log('Modification de la question:', this.newQuestion);
  }

  onSubmit(): void {
    if (!this.quizId) {
      this.errorMessage = 'Aucun quiz sélectionné';
      console.error(this.errorMessage);
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement (contenu, score > 0, toutes les réponses, une réponse correcte)';
      console.error(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Soumission:', this.newQuestion);

    if (this.isEditing && this.currentQuestionId) {
      // Mode modification
      this.questionService.updateQuestion(this.currentQuestionId, this.newQuestion).subscribe({
        next: (questionResponse: Question) => {
          const questionId = questionResponse.idQuestion;
          if (!questionId) {
            this.errorMessage = 'ID de la question non retourné';
            this.isLoading = false;
            return;
          }

          // Mettre à jour les réponses existantes
          const reponseObservables = this.newQuestion.reponses.map(reponse => {
            if (reponse.idReponse) {
              return this.reponseService.updateReponse(reponse.idReponse, reponse);
            } else {
              return this.reponseService.addReponseToQuestion(questionId, reponse);
            }
          });

          Promise.all(reponseObservables.map(obs => obs.toPromise())).then(
            () => {
              this.isLoading = false;
              this.successMessage = 'Question et réponses modifiées avec succès!';
              console.log('Toutes les réponses mises à jour');
              this.resetForm();
              this.loadQuestions();
            },
            (error: HttpErrorResponse) => {
              this.isLoading = false;
              this.errorMessage = 'Erreur lors de la mise à jour des réponses: ' + error.message;
              console.error('Erreur:', error);
            }
          );
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la modification de la question: ' + error.message;
          console.error('Erreur:', error);
        }
      });
    } else {
      // Mode ajout
      this.questionService.addQuestionToQuiz(this.quizId, this.newQuestion).subscribe({
        next: (questionResponse: Question) => {
          const questionId = questionResponse.idQuestion;
          if (!questionId) {
            this.errorMessage = 'ID de la question non retourné';
            this.isLoading = false;
            return;
          }

          const reponseObservables = this.newQuestion.reponses.map(reponse =>
            this.reponseService.addReponseToQuestion(questionId, reponse)
          );

          Promise.all(reponseObservables.map(obs => obs.toPromise())).then(
            () => {
              this.isLoading = false;
              this.successMessage = 'Question et réponses ajoutées avec succès!';
              console.log('Toutes les réponses ajoutées');
              this.resetForm();
              this.loadQuestions();
            },
            (error: HttpErrorResponse) => {
              this.isLoading = false;
              this.errorMessage = 'Erreur lors de l\'ajout des réponses: ' + error.message;
              console.error('Erreur:', error);
            }
          );
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de l\'ajout de la question: ' + error.message;
          console.error('Erreur:', error);
        }
      });
    }
  }

  deleteQuestion(idQuestion: number | undefined): void {
    if (!idQuestion) {
      this.errorMessage = 'ID de la question invalide';
      console.error(this.errorMessage);
      return;
    }

    if (confirm('Voulez-vous vraiment supprimer cette question ?')) {
      this.isLoading = true;
      this.questionService.deleteQuestion(idQuestion).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Question supprimée avec succès!';
          console.log('Question supprimée:', idQuestion);
          this.loadQuestions();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la suppression: ' + error.message;
          console.error('Erreur:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.newQuestion = {
      contenu: '',
      score: 0,
      correctAnswer: '',
      reponses: [
        { contenu: '', isCorrect: false, answernum: 'A' },
        { contenu: '', isCorrect: false, answernum: 'B' },
        { contenu: '', isCorrect: false, answernum: 'C' },
        { contenu: '', isCorrect: false, answernum: 'D' }
      ]
    };
    this.isEditing = false;
    this.currentQuestionId = null;
    this.errorMessage = '';
    this.successMessage = '';
    console.log('Formulaire réinitialisé');
  }

  goBack(): void {
    this.router.navigate(['/quiz', this.quizId]);
    console.log('Retour à la page du quiz:', this.quizId);
  }
}