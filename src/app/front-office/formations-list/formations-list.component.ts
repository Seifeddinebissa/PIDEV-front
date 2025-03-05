import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../back-office/services/formation.service'; // Ajustez le chemin si nécessaire
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

  // Price filter variables
  selectedPrice: string = 'all';
  priceOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Prices' },
    { value: '0-999', label: '0 $ - 999 $' },
    { value: '1000-2999', label: '1000 $ - 2999 $' },
    { value: '3000-6999', label: '3000 $ - 6999 $' },
    { value: '7000+', label: 'more than 7000 $' }
  ];

  constructor(private formationService: FormationService, private http: HttpClient) {}

  ngOnInit(): void {
    this.formationService.getAllFormation().subscribe(
      (data) => {
        this.formations = data.filter(f => f.is_public);
        this.filteredFormations = [...this.formations];
        this.publicFormationCount = this.filteredFormations.length;
        this.updatePaginatedFormations();

        // Fetch feedback counts for each formation
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

  filterCourses(): void {
    this.filteredFormations = this.formations.filter(f => {
      const price = Number(f.price);
      if (isNaN(price)) return false;

      switch (this.selectedPrice) {
        case '0-999': return price >= 0 && price <= 999;
        case '1000-2999': return price >= 1000 && price <= 2999;
        case '3000-6999': return price >= 3000 && price <= 6999;
        case '7000+': return price >= 7000;
        default: return true;
      }
    });

    this.publicFormationCount = this.filteredFormations.length;
    this.currentPage = 1;
    this.updatePaginatedFormations();
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

  // Gestion des erreurs de chargement d'image
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/courses/default.jpg';
    console.warn('Image failed to load, using default image');
  }
}