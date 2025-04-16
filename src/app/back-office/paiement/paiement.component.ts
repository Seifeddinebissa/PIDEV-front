import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../services/paiement.service';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css'],
})
export class PaiementComponent implements OnInit {
  listPaiement: any[] = [];
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 10; // Number of items per page
  totalItems: number = 0; // Total number of items

  constructor(private service: PaiementService) {}

  ngOnInit(): void {
    this.service.getAllPaiement().subscribe((data) => {
      this.listPaiement = data;
      this.totalItems = this.listPaiement.length; // Set total items
      console.log(data);
    });
  }

  // Get the items for the current page
  get paginatedPaiements(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.listPaiement.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Get total number of pages
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Navigate to a specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Navigate to the next page
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Navigate to the previous page
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
  exportToPDF(id: string): void {
    this.service.exportStatsToPDF(id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'payment-recu.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors de l’exportation en PDF:', error);
      }
    );
  }
}