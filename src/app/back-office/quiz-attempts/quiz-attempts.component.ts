import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-quiz-attempts',
  templateUrl: './quiz-attempts.component.html',
  styleUrls: ['./quiz-attempts.component.css']
})
export class QuizAttemptsComponent implements OnInit {
  quizScores: any[] = [];
  filteredQuizScores: any[] = [];
  quizNames: string[] = [];
  selectedQuiz: string = ''; // Par défaut vide pour afficher tous les quiz

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuizNames();
    this.loadQuizScores();
  }

  loadQuizScores(): void {
    this.quizService.getAllQuizScores().subscribe({
      next: (data) => {
        this.quizScores = data;
        this.filteredQuizScores = [...this.quizScores]; // Initialiser avec tous les scores
        console.log('Scores récupérés :', this.quizScores);
        console.log('FilteredQuizScores initial :', this.filteredQuizScores);
        this.filterByQuiz(); // Appliquer le filtre immédiatement après chargement
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des scores :', error);
      }
    });
  }

  loadQuizNames(): void {
    this.quizService.getDistinctQuizNames().subscribe({
      next: (data) => {
        this.quizNames = data;
        console.log('Noms des quiz récupérés :', this.quizNames);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des noms des quiz :', error);
      }
    });
  }

  filterByQuiz(): void {
    console.log('Filtrage avec selectedQuiz:', this.selectedQuiz);
    if (!this.selectedQuiz || this.selectedQuiz === '') {
      this.filteredQuizScores = [...this.quizScores]; // Afficher tous les scores si rien n'est sélectionné
    } else {
      this.filteredQuizScores = this.quizScores.filter(score => score.quizName === this.selectedQuiz);
    }
    console.log('Tentatives filtrées :', this.filteredQuizScores);
  }

  deleteScore(idScoreQuiz: number): void {
    if (idScoreQuiz === undefined || idScoreQuiz === null) {
      console.error('ID du ScoreQuiz non défini:', idScoreQuiz);
      alert('Erreur : ID de la tentative non trouvé.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette tentative de quiz ?')) {
      this.quizService.deleteScoreQuiz(idScoreQuiz).subscribe({
        next: () => {
          this.quizScores = this.quizScores.filter(score => score.idScoreQuiz !== idScoreQuiz);
          this.filterByQuiz(); // Réappliquer le filtre après suppression
          console.log('Tentative supprimée avec succès, ID:', idScoreQuiz);
          alert('Tentative supprimée avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la tentative:', error);
          alert('Erreur lors de la suppression de la tentative.');
        }
      });
    }
  }
}