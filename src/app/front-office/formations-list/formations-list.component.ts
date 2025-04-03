import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../back-office/services/formation.service';
import { HttpClient } from '@angular/common/http';
import { Formation } from 'src/app/back-office/models/Formation';

@Component({
  selector: 'app-formations-list',
  templateUrl: './formations-list.component.html',
  styleUrls: ['./formations-list.component.css']
})
export class FormationsListComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  paginatedFormations: Formation[] = [];
  feedbackCounts: { [key: number]: number } = {};
  publicFormationCount: number = 0;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 6;

  // Advanced filter variables
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minDuration: number | null = null;
  maxDuration: number | null = null;
  searchTitle: string = '';

  // Sort variables
  sortBy: string = 'none'; // Default to 'none' (no sorting)
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private formationService: FormationService, private http: HttpClient) {}

  ngOnInit(): void {
    this.formationService.getAllFormation().subscribe(
      (data) => {
        this.formations = data.filter(f => f.is_public);
        this.filteredFormations = [...this.formations];
        this.publicFormationCount = this.filteredFormations.length;
        this.applySortAndFilter();

        this.formations.forEach(formation => this.getFeedbackCount(formation.id));
      },
      (error) => {
        console.error("Error loading formations", error);
      }
    );
  }

  getFeedbackCount(formation_id: number): void {
    this.formationService.getFeedbackCountByFormation(formation_id).subscribe(
      (count) => {
        this.feedbackCounts[formation_id] = count;
      },
      (error) => {
        console.error(`Error loading feedbacks for formation ${formation_id}`, error);
      }
    );
  }

  applySortAndFilter(): void {
    // Step 1: Apply filters
    let result = this.formations.filter(f => {
      const price = Number(f.price);
      const duration = Number(f.duration);
      const title = f.title.toLowerCase();

      const priceValid = 
        (this.minPrice === null || price >= this.minPrice) &&
        (this.maxPrice === null || price <= this.maxPrice);

      const durationValid = 
        (this.minDuration === null || duration >= this.minDuration) &&
        (this.maxDuration === null || duration <= this.maxDuration);

      const titleValid = this.searchTitle === '' || title.includes(this.searchTitle.toLowerCase());

      return priceValid && durationValid && titleValid;
    });

    // Step 2: Apply sorting only if sortBy is not 'none'
    if (this.sortBy !== 'none') {
      result.sort((a, b) => {
        let comparison = 0;
        switch (this.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'price':
            comparison = Number(a.price) - Number(b.price);
            break;
          case 'duration':
            comparison = Number(a.duration) - Number(b.duration);
            break;
          case 'reviews':
            comparison = (this.feedbackCounts[a.id] || 0) - (this.feedbackCounts[b.id] || 0);
            break;
        }
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.filteredFormations = result;
    this.publicFormationCount = this.filteredFormations.length;
    this.currentPage = 1;
    this.updatePaginatedFormations();
  }

  updateSort(field: string): void {
    if (this.sortBy === field && field !== 'none') {
      // Toggle direction if same field (except for 'none')
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New field, default to ascending (unless 'none')
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.applySortAndFilter();
  }

  clearFilters(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.minDuration = null;
    this.maxDuration = null;
    this.searchTitle = '';
    this.applySortAndFilter();
  }

  get totalPages(): number {
    return Math.ceil(this.publicFormationCount / this.itemsPerPage);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedFormations();
    }
  }

  updatePaginatedFormations(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFormations = this.filteredFormations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/courses/default.jpg';
    console.warn('Image failed to load, using default image');
  }
}