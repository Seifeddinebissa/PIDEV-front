import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  listCours: any[] = []; // Liste complète des cours
  paginatedCours: any[] = []; // Liste paginée pour l'affichage
  currentPage: number = 1; // Page actuelle
  pageSize: number = 6; // 3 cours par page
  totalPages: number = 0; // Nombre total de pages

  constructor(private service: CoursesService) {}

  ngOnInit(): void {
    this.loadCours();
  }

  loadCours(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.listCours = data;
        this.updatePagination(); // Initialise la pagination après chargement
        console.log('Liste des cours récupérée :', this.listCours);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des cours :', error);
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.listCours.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCours = this.listCours.slice(startIndex, endIndex);
    console.log('Cours paginés :', this.paginatedCours, 'Page actuelle :', this.currentPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}