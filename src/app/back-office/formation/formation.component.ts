import { Component } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent {
  listFormation: any[] = [];
  filteredFormation: any[] = [];
  paginatedFormation: any[] = []; // Nouvelle liste pour les éléments paginés
  searchQuery: string = '';

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5; // 5 éléments par page, ajustable
  totalItems: number = 0; // Nombre total d'éléments après filtrage

  constructor(private service: FormationService, private router: Router) {}

  ngOnInit(): void {
    this.service.getAllFormation().subscribe(
      data => {
        console.log("Données reçues :", data);
        this.listFormation = data;
        this.filteredFormation = data;
        this.totalItems = this.filteredFormation.length;
        this.updatePaginatedFormation();
      },
      error => {
        console.error("Erreur de récupération :", error);
      }
    );
  }

  searchCourses(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredFormation = [...this.listFormation];
    } else {
      this.filteredFormation = this.listFormation.filter(formation =>
        formation.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.totalItems = this.filteredFormation.length;
    this.currentPage = 1; // Réinitialiser à la première page après recherche
    this.updatePaginatedFormation();
  }

  deleteFormation(id: number, event: Event): void {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this course?')) {
      this.service.deleteFormation(id).subscribe(() => {
        this.listFormation = this.listFormation.filter(f => f.id !== id);
        this.filteredFormation = this.filteredFormation.filter(f => f.id !== id);
        this.totalItems = this.filteredFormation.length;
        this.updatePaginatedFormation();
      });
    }
  }

  addFormation(): void {
    this.router.navigate(['/formations/add']);
  }

  exportToCsv(): void {
    const headers = ['ID', 'Title', 'Description', 'Duration (hours)', 'Price ($)', 'Public'];
    const rows = this.filteredFormation.map(formation => [
      formation.id,
      `"${formation.title.replace(/"/g, '""')}"`,
      `"${formation.description.replace(/"/g, '""')}"`,
      formation.duration,
      formation.price,
      formation.is_public ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'trainings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedFormation();
    }
  }

  updatePaginatedFormation(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFormation = this.filteredFormation.slice(startIndex, endIndex);
  }
}