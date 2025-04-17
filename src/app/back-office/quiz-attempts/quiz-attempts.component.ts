import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-quiz-attempts',
  templateUrl: './quiz-attempts.component.html',
  styleUrls: ['./quiz-attempts.component.css']
})
export class QuizAttemptsComponent implements OnInit {
  quizScores: any[] = [];
  filteredQuizScores: any[] = [];
  quizNames: string[] = [];
  selectedQuiz: string = '';

  // Configuration du graphique en courbe avec typage explicite
  public chart: {
    title: string;
    type: ChartType;
    data: number[][]; // Typage explicite pour éviter l'erreur TS2322
    columnNames: string[];
    options: any;
  } = {
    title: 'Notes des élèves par tentative',
    type: ChartType.LineChart,
    data: [[1, 0]], // Valeur par défaut pour éviter un graphique vide
    columnNames: ['Tentative', 'Note (%)'],
    options: {
      hAxis: {
        title: 'Numéro de tentative',
        format: '#', // Format numérique
        textStyle: { fontSize: 12 }
      },
      vAxis: {
        title: 'Note (%)',
        minValue: 0,
        maxValue: 100,
        textStyle: { fontSize: 12 }
      },
      legend: { position: 'none' },
      colors: ['#36A2EB'],
      animation: {
        startup: false,
        duration: 0 // Pas d'animation
      },
      chartArea: { width: '80%', height: '70%' },
      pointSize: 5,
      curveType: 'function'
    }
  };

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuizNames();
    this.loadQuizScores();
  }

  loadQuizScores(): void {
    this.quizService.getAllQuizScores().subscribe({
      next: (data) => {
        this.quizScores = data;
        this.filteredQuizScores = [...this.quizScores];
        console.log('Scores récupérés :', this.quizScores);
        this.updateChartData();
        this.filterByQuiz();
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
      this.filteredQuizScores = [...this.quizScores];
    } else {
      this.filteredQuizScores = this.quizScores.filter(score => score.quizName === this.selectedQuiz);
    }
    console.log('Tentatives filtrées :', this.filteredQuizScores);
    this.updateChartData();
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
          this.filterByQuiz();
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

  updateChartData(): void {
    const chartData: number[][] = this.filteredQuizScores.map((score, index) => {
      const percentage = score.maxScore ? (score.score / score.maxScore) * 100 : 0;
      return [index + 1, percentage]; // Axe X: Numérique, Axe Y: Pourcentage
    });

    this.chart.data = chartData.length > 0 ? chartData : [[1, 0]];
    console.log('Données du graphique mises à jour :', this.chart.data);
  }
}