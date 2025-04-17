import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EventStatisticsService, DashboardStatistics } from '../services/event-statistics.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Import Chart.js with proper type definitions
import { Chart } from 'chart.js/auto';
// Define the chart context interface for callbacks
interface ChartContext {
  parsed: { y: number };
  label: string;
  dataset: { data: number[] };
}

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.component.html',
  styleUrls: ['./event-stats.component.css']
})
export class EventStatsComponent implements OnInit, OnDestroy, AfterViewInit {
  statistics: DashboardStatistics | null = null;
  loading = true;
  error: string | null = null;
  lastUpdated: Date = new Date();
  
  // Object needs to be exposed to template
  Object = Object;
  
  // Chart references
  @ViewChild('locationChart') locationChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('capacityChart') capacityChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dayOfWeekChart') dayOfWeekChartRef!: ElementRef<HTMLCanvasElement>;
  
  locationChart: Chart | null = null;
  monthlyChart: Chart | null = null;
  capacityChart: Chart | null = null;
  dayOfWeekChart: Chart | null = null;
  
  // Widget visibility toggles
  showLocationChart = true;
  showMonthlyChart = true;
  showCapacityChart = true;
  showDayOfWeekChart = true;
  
  private destroy$ = new Subject<void>();

  constructor(private statisticsService: EventStatisticsService) { }

  ngOnInit(): void {
    this.fetchDashboardStatistics();
  }

  ngAfterViewInit(): void {
    // If statistics are already loaded, initialize charts
    if (this.statistics && !this.loading) {
      setTimeout(() => {
        this.initCharts();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up charts
    this.destroyCharts();
  }
  
  fetchDashboardStatistics(): void {
    this.loading = true;
    this.error = null;
    
    this.statisticsService.getDashboardStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Fetched statistics:', data);
          this.statistics = data;
          this.lastUpdated = new Date();
          this.loading = false;
          
          // Initialize charts after view is ready
          setTimeout(() => {
            this.initCharts();
          }, 100);
        },
        error: (err) => {
          console.error('Error fetching dashboard statistics:', err);
          this.error = 'Failed to load statistics. Please try again later.';
          this.loading = false;
        }
      });
  }
  
  refreshData(): void {
    this.statisticsService.clearCache();
    this.fetchDashboardStatistics();
  }
  
  toggleWidget(widget: string): void {
    switch (widget) {
      case 'location':
        this.showLocationChart = !this.showLocationChart;
        break;
      case 'monthly':
        this.showMonthlyChart = !this.showMonthlyChart;
        break;
      case 'capacity':
        this.showCapacityChart = !this.showCapacityChart;
        break;
      case 'dayOfWeek':
        this.showDayOfWeekChart = !this.showDayOfWeekChart;
        break;
    }
    // Reinitialize charts when toggling visibility
    if (this.showLocationChart || this.showMonthlyChart || 
        this.showCapacityChart || this.showDayOfWeekChart) {
      setTimeout(() => this.initCharts(), 50);
    }
  }
  
  private initCharts(): void {
    if (!this.statistics) {
      console.warn('Cannot initialize charts: statistics data is missing');
      return;
    }
    
    this.destroyCharts();
    
    // Location chart
    if (this.locationChartRef && this.statistics.eventsByLocation && this.showLocationChart) {
      const ctx = this.locationChartRef.nativeElement.getContext('2d');
      if (!ctx) {
        console.warn('Failed to get 2D context for location chart');
        return;
      }
      
      const locations = Object.keys(this.statistics.eventsByLocation);
      const counts = locations.map(loc => this.statistics?.eventsByLocation[loc] || 0);
      
      console.log('Creating location chart with data:', { locations, counts });
      
      this.locationChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: locations,
          datasets: [{
            label: 'Events by Location',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Event Distribution by Location'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  // Calculate the total
                  let total = 0;
                  context.chart.data.datasets[0].data.forEach(item => {
                    total += Number(item || 0);
                  });
                  // Calculate percentage
                  const percentage = total > 0 ? Math.round((Number(value || 0) * 100) / total) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    }
    
    // Monthly chart
    if (this.monthlyChartRef && this.statistics.eventsPerMonth && this.showMonthlyChart) {
      const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
      if (!ctx) {
        console.warn('Failed to get 2D context for monthly chart');
        return;
      }
      
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const counts = months.map((_, i) => this.statistics?.eventsPerMonth[(i + 1).toString()] || 0);
      
      console.log('Creating monthly chart with data:', { months, counts });
      
      this.monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Events per Month',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monthly Event Distribution'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    }
    
    // Capacity chart
    if (this.capacityChartRef && this.statistics.eventsByCapacity && this.showCapacityChart) {
      const ctx = this.capacityChartRef.nativeElement.getContext('2d');
      if (!ctx) {
        console.warn('Failed to get 2D context for capacity chart');
        return;
      }
      
      const ranges = Object.keys(this.statistics.eventsByCapacity);
      const counts = ranges.map(range => this.statistics?.eventsByCapacity[range] || 0);
      
      console.log('Creating capacity chart with data:', { ranges, counts });
      
      this.capacityChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ranges,
          datasets: [{
            data: counts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Events by Capacity'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  // Calculate the total
                  let total = 0;
                  context.chart.data.datasets[0].data.forEach(item => {
                    total += Number(item || 0);
                  });
                  // Calculate percentage
                  const percentage = total > 0 ? Math.round((Number(value || 0) * 100) / total) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // Day of Week chart
    if (this.dayOfWeekChartRef && this.statistics.eventsByDayOfWeek && this.showDayOfWeekChart) {
      const ctx = this.dayOfWeekChartRef.nativeElement.getContext('2d');
      if (!ctx) {
        console.warn('Failed to get 2D context for day of week chart');
        return;
      }
      
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const counts = days.map(day => this.statistics?.eventsByDayOfWeek[day] || 0);
      
      console.log('Creating day of week chart with data:', { days, counts });
      
      this.dayOfWeekChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: days,
          datasets: [{
            label: 'Events by Day of Week',
            data: counts,
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Event Distribution by Day of Week'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    }
  }
  
  private destroyCharts(): void {
    if (this.locationChart) {
      this.locationChart.destroy();
      this.locationChart = null;
    }
    
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
      this.monthlyChart = null;
    }
    
    if (this.capacityChart) {
      this.capacityChart.destroy();
      this.capacityChart = null;
    }
    
    if (this.dayOfWeekChart) {
      this.dayOfWeekChart.destroy();
      this.dayOfWeekChart = null;
    }
  }
  
  formatDate(date: Date): string {
    return date.toLocaleString();
  }
  
  // Helper method to get the number of locations
  getLocationCount(): number {
    return this.statistics?.eventsByLocation ? Object.keys(this.statistics.eventsByLocation).length : 0;
  }
} 