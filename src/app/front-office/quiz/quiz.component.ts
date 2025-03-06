import { Component, OnInit, OnDestroy } from '@angular/core'; // Ajout de OnDestroy
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
  timeLeft = 20; // 10 minutes en secondes (600 secondes)
  timer: any = null; // Identifiant du setInterval

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
    this.startTimer(); // Démarrer le compte à rebours au chargement
  }

  ngOnDestroy(): void {
    this.clearTimer(); // Nettoyer le timer lors de la destruction du composant
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
    if (!this.isSubmitted) { // Empêcher la sélection après soumission ou expiration
      question.selectedAnswer = reponse.answernum;
      console.log(`Réponse sélectionnée pour ${question.contenu}: ${reponse.answernum}`);
    }
  }

  

  private submitAnswers(isTimedOut: boolean = false): void {
    const userId = 1;
    const userAnswers: { [key: number]: string } = {};
    
    this.quiz.questions.forEach(q => {
      if (q.idQuestion) {
        userAnswers[q.idQuestion] = q.selectedAnswer || '';
      } else {
        console.warn(`Question ${q.contenu} n'a pas d'ID`, q);
      }
    });
  
    console.log('Réponses envoyées au backend:', userAnswers);
  
    this.quizService.submitQuiz(this.quizId!, userId, userAnswers, { isTimedOut }).subscribe({
      next: (scoreQuiz) => {
        console.log('Réponse complète du backend (soumission):', scoreQuiz);
        this.totalScore = scoreQuiz.score || 0;
        console.log('Score total mis à jour après soumission:', this.totalScore);
      },
      error: (error: HttpErrorResponse) => this.handleError('Erreur lors de l\'enregistrement du score', error)
    });
  }
  
  // Mettre à jour submitQuiz et startTimer
  submitQuiz(): void {
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.clearTimer();
      this.submitAnswers(false); // Soumission manuelle
    }
  }
  
  private startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0 && !this.isSubmitted) {
        this.timeLeft--;
        console.log('Temps restant:', this.timeLeft);
      } else if (this.timeLeft === 0 && !this.isSubmitted) {
        console.log('Temps écoulé, soumission automatique avec score 0');
        this.isSubmitted = true;
        this.clearTimer();
        this.submitAnswers(true); // Soumission automatique avec isTimedOut
      }
    }, 1000);
  }

 

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Formater le temps restant en minutes:secondes
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
  }
}