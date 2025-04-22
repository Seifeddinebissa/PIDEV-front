import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../../back-office/models/Reclamation';
import { ReclamationService } from '../../back-office/services/reclamation.service';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  newReclamation: Reclamation = {
    subject: '',
    description: '',
    dateSubmitted: new Date(),
    status: 'En attente'
  };
  selectedReclamation?: Reclamation;
  successMessage: string = '';
  errorMessage: string = '';
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  currentView: string = 'list';
  statsByStatus = { enAttente: 0, enCours: 0, resolu: 0, total: 0 };
  filterStatus: string = '';
  searchTerm: string = '';
  sortField: string = 'dateSubmitted';
  sortDirection: string = 'desc';
  loadingReclamationIds: number[] = [];
  showPdfViewer: boolean = false;
  selectedPdfUrl: string | null = null;


  constructor(
    private reclamationService: ReclamationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getReclamationsWithPagination(
      this.currentPage,
      this.pageSize,
      this.filterStatus,
      this.searchTerm,
      undefined,
      this.sortField,
      this.sortDirection as 'asc' | 'desc'
      
    ).subscribe({
      next: (response) => {
        this.reclamations = response.content ?? [];
        this.filteredReclamations = [...this.reclamations];
        this.totalPages = response.totalPages ?? 0;
        this.totalElements = response.totalElements ?? 0;
        this.totalElements = response.totalElements ?? 0;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des réclamations : ' + err.message;
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadReclamations();
  }

  validateReclamation(reclamation: Reclamation): boolean {
    if (!reclamation.subject.trim() || !reclamation.description.trim()) {
      this.errorMessage = 'Le sujet et la description sont obligatoires.';
      return false;
    }
    if (reclamation.subject.length > 100) {
      this.errorMessage = 'Le sujet ne doit pas dépasser 100 caractères.';
      return false;
    }
    if (reclamation.description.length > 500) {
      this.errorMessage = 'La description ne doit pas dépasser 500 caractères.';
      return false;
    }
    return true;
  }

  addReclamation(): void {
    if (this.validateReclamation(this.newReclamation)) {
      this.newReclamation.status = 'En attente';
      this.reclamationService.addReclamation(this.newReclamation).subscribe({
        next: () => {
          this.successMessage = 'Réclamation ajoutée avec succès !';
          this.loadReclamations();
          this.resetForm();
          this.showList();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout : ' + err.message;
          setTimeout(() => (this.errorMessage = ''), 5000);
        }
      });
    }
  }

  editReclamation(reclamation: Reclamation): void {
    this.selectedReclamation = { ...reclamation };
    this.successMessage = '';
    this.errorMessage = '';
  }

  updateReclamation(): void {
    if (this.selectedReclamation && this.selectedReclamation.id && this.validateReclamation(this.selectedReclamation)) {
      this.reclamationService.updateReclamation(this.selectedReclamation.id, this.selectedReclamation).subscribe({
        next: () => {
          this.successMessage = 'Réclamation mise à jour avec succès !';
          this.loadReclamations();
          this.selectedReclamation = undefined;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour : ' + err.message;
          setTimeout(() => (this.errorMessage = ''), 5000);
        }
      });
    }
  }

  deleteReclamation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.reclamationService.deleteReclamation(id).subscribe({
        next: () => {
          this.successMessage = 'Réclamation supprimée avec succès !';
          this.loadReclamations();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression : ' + err.message;
          setTimeout(() => (this.errorMessage = ''), 5000);
        }
      });
    }
  }

  showList(): void {
    this.currentView = 'list';
    this.resetForm();
  }

  showAddForm(): void {
    this.currentView = 'add';
    this.selectedReclamation = undefined;
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 0;
    this.loadReclamations();
  }

  selectStatus(status: string): void {
    this.filterStatus = status;
    this.currentPage = 0;
    this.loadReclamations();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadReclamations();
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadReclamations();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadReclamations();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadReclamations();
    }
  }

  resetForm(): void {
    this.newReclamation = {
      subject: '',
      description: '',
      dateSubmitted: new Date(),
      status: 'En attente'
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.selectedReclamation = undefined;
    this.successMessage = '';
    this.errorMessage = '';
  }

  exportToPDF(): void {
    this.reclamationService.exportToPDF().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reclamations.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'exportation en PDF : ' + err.message;
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  exportToExcel(): void {
    this.reclamationService.exportToExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reclamations.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'exportation en Excel : ' + err.message;
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  

  viewPdf(id: number): void {
    if (!id) {
      this.errorMessage = 'ID de réclamation invalide.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }
    this.loadingReclamationIds.push(id);
    this.reclamationService.downloadSolution(id).subscribe({
      next: (blob) => {
        if (blob.size === 0) {
          this.errorMessage = 'Le fichier téléchargé est vide.';
          this.loadingReclamationIds = this.loadingReclamationIds.filter((loadingId) => loadingId !== id);
          setTimeout(() => (this.errorMessage = ''), 5000);
          return;
        }
        const url = window.URL.createObjectURL(blob);
        this.selectedPdfUrl = url;
        this.showPdfViewer = true;
        this.loadingReclamationIds = this.loadingReclamationIds.filter((loadingId) => loadingId !== id);
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du chargement du PDF : ${err.status === 404 ? 'Fichier non trouvé.' : err.message}`;
        this.loadingReclamationIds = this.loadingReclamationIds.filter((loadingId) => loadingId !== id);
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  closePdfViewer(): void {
    this.showPdfViewer = false;
    if (this.selectedPdfUrl) {
      window.URL.revokeObjectURL(this.selectedPdfUrl as string);
      this.selectedPdfUrl = null;
    }
  }


  downloadPdf(id: number): void {
    if (!id) {
      this.errorMessage = 'ID de réclamation invalide.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }
  
    this.loadingReclamationIds.push(id);
    this.reclamationService.downloadSolution(id).subscribe({
      next: (blob) => {
        if (blob.size === 0) {
          this.errorMessage = 'Le fichier téléchargé est vide.';
          this.loadingReclamationIds = this.loadingReclamationIds.filter((loadingId) => loadingId !== id);
          setTimeout(() => (this.errorMessage = ''), 5000);
          return;
        }
  
        // Créer une URL pour le blob et déclencher le téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solution_${id}.pdf`; // Correspond au nom de fichier du backend
        link.click();
        window.URL.revokeObjectURL(url); // Nettoyer l'URL
  
        this.loadingReclamationIds = this.loadingReclamationIds.filter((loadingId) => loadingId !== id);
        this.successMessage = 'Fichier téléchargé avec succès !';
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du téléchargement du PDF : ${
          err.status === 404 ? 'Fichier non trouvé.' : err.message
        }`;
        this.loadingReclamationIds = this.loadingReclamationIds.filter((loadingId) => loadingId !== id);
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }
  
}