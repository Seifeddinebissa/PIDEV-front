import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { FavoriteStats, OffreService } from 'src/app/front-office/services/offre.service';

@Component({
  selector: 'app-stat-offre',
  templateUrl: './stat-offre.component.html',
  styleUrls: ['./stat-offre.component.css']
})
export class StatOffreComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  staticStudentId: number = 123; // Not used in current logic—remove if unnecessary
  topFavorited: FavoriteStats[] = [];
  maxFavoriteCount: number = 0;

  // Chart configuration
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Offers' } },
      y: { title: { display: true, text: 'Number of Favorites' }, beginAtZero: true }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Favorites', backgroundColor: '#007bff', borderColor: '#007bff', borderWidth: 1, hoverBackgroundColor: '#007bff' }]
  };

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadTopFavorited();
  }

  loadTopFavorited(): void {
    this.loading = true;
    this.offreService.getFavoriteAnalytics(5).subscribe({
      next: (data) => {
        this.topFavorited = data;
        this.updateChartData(); // Update chart after data is loaded
        this.maxFavoriteCount = Math.max(...this.topFavorited.map(stat => stat.favoriteCount));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load favorite analytics. Please try again later.';
        console.error('Error fetching top favorited:', err);
        this.loading = false;
      }
    });
  }

  private updateChartData(): void {
    this.barChartData.labels = this.topFavorited.map(stat => stat.offre.title);
    this.barChartData.datasets[0].data = this.topFavorited.map(stat => stat.favoriteCount);
  }
}