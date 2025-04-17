import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { QuestionService } from '../services/question.service';
import { ReponseService } from '../services/reponse.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface Reponse {
  idReponse?: number;
  contenu: string;
  isCorrect: boolean;
  answernum: string;
  questionId?: number;
}

export interface Question {
  idQuestion?: number;
  contenu: string;
  score: number;
  correctAnswer: string;
  quizId?: number;
  reponses: Reponse[];
  selectedAnswer?: string;
}

export interface Quiz {
  idQuiz: number;
  titre: string;
  description: string;
  questions: Question[];
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  quizId: number | null = null;
  quiz: Quiz = { idQuiz: 0, titre: '', description: '', questions: [] };
  isLoading = false;
  errorMessage = '';
  isSubmitted = false;
  totalScore = 0;
  maxScore = 0;
  timeLeft = 600; // 10 minutes en secondes
  timer: any = null;
  isFullscreen = false;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private questionService: QuestionService,
    private reponseService: ReponseService
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.quizId) {
      this.handleError('Aucun ID de quiz valide trouvé dans l\'URL');
      return;
    }
    this.loadQuizDetails();
    this.enterFullscreen();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.exitFullscreen();
  }

  // Écouter les tentatives de quitter la page
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent): void {
    if (!this.isSubmitted) {
      event.preventDefault();
      event.returnValue = 'Vous êtes en train de passer un quiz. Voulez-vous vraiment quitter ?';
    }
  }

  // Détecter les changements de visibilité (changement d'onglet)
  @HostListener('document:visibilitychange')
  visibilityChange(): void {
    if (!this.isSubmitted && document.hidden) {
      // Afficher une alerte et soumettre automatiquement après la fermeture
      alert('Veuillez rester sur la page du quiz. Toute tentative de quitter peut entraîner une soumission automatique.');
      this.isSubmitted = true;
      this.clearTimer();
      this.submitAnswers(true);
      this.exitFullscreen();
    }
  }

  // Écouter les changements de mode plein écran
  @HostListener('fullscreenchange')
  fullscreenChange(): void {
    if (!this.isSubmitted && !document.fullscreenElement) {
      console.log('Sortie du mode plein écran détectée');
      this.isFullscreen = false;
      this.isSubmitted = true;
      this.clearTimer();
      this.submitAnswers(true);
    }
  }

  private enterFullscreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => {
        this.isFullscreen = true;
        console.log('Mode plein écran activé');
      }).catch(err => {
        console.error('Erreur lors de l\'activation du plein écran:', err);
        this.errorMessage = 'Le mode plein écran n’est pas supporté.';
      });
    }
  }

  private exitFullscreen(): void {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
        console.log('Mode plein écran désactivé');
      }).catch(err => {
        console.error('Erreur lors de la sortie du plein écran:', err);
      });
    }
  }

  private loadQuizDetails(): void {
    this.isLoading = true;
    this.quizService.getQuizById(this.quizId!).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.loadQuestions();
      },
      error: (error: HttpErrorResponse) => this.handleError('Erreur lors du chargement du quiz', error)
    });
  }

  private loadQuestions(): void {
    this.questionService.getQuestionsByQuizId(this.quizId!).subscribe({
      next: (questions) => {
        this.quiz.questions = questions.map(q => ({ ...q, selectedAnswer: '' }));
        this.maxScore = this.quiz.questions.reduce((sum, q) => sum + (q.score || 0), 0);
        console.log('Questions chargées:', this.quiz.questions);
        console.log('Score maximum possible:', this.maxScore);
        this.quiz.questions.forEach(question => this.loadReponsesForQuestion(question));
      },
      error: (error: HttpErrorResponse) => this.handleError('Erreur lors du chargement des questions', error)
    });
  }

  private loadReponsesForQuestion(question: Question): void {
    this.reponseService.getReponsesByQuestionId(question.idQuestion!).subscribe({
      next: (reponses) => {
        question.reponses = reponses;
        if (this.quiz.questions.every(q => q.reponses && q.reponses.length > 0)) {
          this.isLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => this.handleError('Erreur lors du chargement des réponses', error)
    });
  }

  selectAnswer(question: Question, reponse: Reponse): void {
    if (!this.isSubmitted) {
      question.selectedAnswer = reponse.answernum;
      console.log(`Réponse sélectionnée pour ${question.contenu}: ${reponse.answernum}`);
    }
  }

  submitQuiz(isTimedOut: boolean = false): void {
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.clearTimer();
      this.submitAnswers(isTimedOut);
      this.exitFullscreen();
    }
  }

  private submitAnswers(isTimedOut: boolean): void {
    const userId = 1; // À remplacer par l'ID utilisateur authentifié
    const userAnswers: { [key: number]: string } = {};

    this.quiz.questions.forEach(q => {
      if (q.idQuestion) {
        userAnswers[q.idQuestion] = q.selectedAnswer || '';
      } else {
        console.warn(`Question ${q.contenu} n'a pas d'ID`, q);
      }
    });

    console.log('Envoi des réponses:', { quizId: this.quizId, userId, userAnswers, isTimedOut });

    this.quizService.submitQuiz(this.quizId!, userId, userAnswers, { isTimedOut }).subscribe({
      next: (scoreQuiz) => {
        console.log('Réponse brute du backend:', scoreQuiz);
        this.totalScore = scoreQuiz.score || 0;
        console.log('Score total:', this.totalScore);
      },
      error: (error: HttpErrorResponse) => this.handleError('Erreur lors de l\'enregistrement du score', error)
    });
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0 && !this.isSubmitted) {
        this.timeLeft--;
        console.log('Temps restant:', this.timeLeft);
      } else if (this.timeLeft === 0 && !this.isSubmitted) {
        console.log('Temps écoulé, soumission automatique');
        this.submitQuiz(true);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('Timer arrêté avec succès');
    } else {
      console.log('Aucun timer actif');
    }
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  isAnswerCorrect(question: Question): boolean {
    return question.selectedAnswer === question.correctAnswer;
  }

  areAllQuestionsAnswered(): boolean {
    return this.quiz.questions.every(q => q.selectedAnswer !== undefined && q.selectedAnswer !== '');
  }

  private handleError(message: string, error?: HttpErrorResponse): void {
    this.isLoading = false;
    this.errorMessage = `${message}${error ? ': ' + error.message : ''}`;
    console.error(this.errorMessage, error);
    this.isSubmitted = true;
    this.clearTimer();
    this.exitFullscreen();
  }
}