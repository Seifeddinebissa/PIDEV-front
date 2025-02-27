import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../back-office/services/formation.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formations-list',
  templateUrl: './formations-list.component.html',
  styleUrls: ['./formations-list.component.css']
})
export class FormationsListComponent implements OnInit {

  formations: any[] = [];
  filteredFormations: any[] = [];
  paginatedFormations: any[] = [];
  feedbackCounts: { [key: number]: number } = {};
  publicFormationCount: number = 0;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 6;

  // Price filter variables
  selectedPrice: string = 'all'; // Default to 'all' to show all formations
  priceOptions: { value: string, label: string }[] = [
    { value: 'all', label: 'All Prices' },
    { value: '0-999', label: '0 $ - 999 $' },
    { value: '1000-2999', label: '1000 $ - 2999 $' },
    { value: '3000-6999', label: '3000 $ - 6999 $' },
    { value: '7000+', label: 'more than 7000 $' }
  ];

  constructor(private formationService: FormationService, private http: HttpClient) { }

  ngOnInit(): void {
    this.formationService.getAllFormation().subscribe(
      (data) => {
        this.formations = data.filter(f => f.is_public);
        this.filteredFormations = [...this.formations]; // Initialize filtered formations
        this.publicFormationCount = this.filteredFormations.length;
        this.updatePaginatedFormations(); // Initialize pagination

        // Fetch feedback counts for each formation
        this.formations.forEach(formation => this.getFeedbackCount(formation.id));
      },
      (error) => {
        console.error("Error loading formations", error);
      }
    );
  }

  // Get feedback count for a formation
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

  // Apply price filter to formations
  filterCourses(): void {
    this.filteredFormations = this.formations.filter(f => {
      const price = Number(f.price);
      if (isNaN(price)) return false;

      switch (this.selectedPrice) {
        case '0-999': return price >= 0 && price <= 999;
        case '1000-2999': return price >= 1000 && price <= 2999;
        case '3000-6999': return price >= 3000 && price <= 6999;
        case '7000+': return price >= 7000;
        default: return true; // 'all' option: show all formations
      }
    });

    this.publicFormationCount = this.filteredFormations.length;
    this.currentPage = 1; // Reset pagination to first page
    this.updatePaginatedFormations();
  }

  // Calculate total pages dynamically
  get totalPages(): number {
    return Math.ceil(this.publicFormationCount / this.itemsPerPage);
  }

  // Generate array of pages dynamically
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Change the page and update displayed formations
  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedFormations();
    }
  }

  // Update paginated formations based on the current page
  updatePaginatedFormations(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFormations = this.filteredFormations.slice(startIndex, startIndex + this.itemsPerPage);
  }
}