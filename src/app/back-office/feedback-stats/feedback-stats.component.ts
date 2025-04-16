// src/app/back-office/feedback-stats/feedback-stats.component.ts
import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-feedback-stats',
  templateUrl: './feedback-stats.component.html',
  styleUrls: ['./feedback-stats.component.css']
})
export class FeedbackStatsComponent implements OnInit {
  stats: any[] = [];

  // Options globales pour les graphiques PrimeNG
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          },
          color: '#333'
        }
      }
    }
  };

  // Couleurs pour les segments du graphique
  public chartColors: string[] = [
    '#FF6384', // Rouge pour note 1
    '#FF9F40', // Orange pour note 2
    '#FFCD56', // Jaune pour note 3
    '#4BC0C0', // Cyan pour note 4
    '#36A2EB'  // Bleu pour note 5
  ];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.feedbackService.getAllFormationsFeedbackStats().subscribe(
      (data) => {
        console.log('Données des stats reçues :', data);
        this.stats = data.map(stat => {
          // Préparer les données pour le graphique de distribution
          const distributionData = [1, 2, 3, 4, 5].map(rating => stat.distribution[rating] || 0);
          return {
            ...stat,
            chartData: {
              labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
              datasets: [{
                data: distributionData,
                backgroundColor: this.chartColors,
                hoverBackgroundColor: this.chartColors,
                borderWidth: 0
              }]
            }
          };
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des stats:', error);
      }
    );
  }

  exportToPDF(): void {
    this.feedbackService.exportStatsToPDF().subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'feedback-stats.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors de l’exportation en PDF:', error);
      }
    );
  }

}