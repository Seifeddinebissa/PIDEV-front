import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../../back-office/models/Reclamation';
import { ReclamationService } from '../../back-office/services/reclamation.service';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
applyFilters() {
throw new Error('Method not implemented.');
}
  reclamations: Reclamation[] = []; // Liste des réclamations
  filteredReclamations: Reclamation[] = []; // Liste filtrée pour l'affichage
  newReclamation: Reclamation = {
    subject: '',
    description: '',
    dateSubmitted: new Date(),
    status: 'En attente' // Statut par défaut
  };
  selectedReclamation?: Reclamation; // Réclamation sélectionnée pour modification
  successMessage: string = ''; // Message de succès
  errorMessage: string = ''; // Message d'erreur
  currentPage: number = 0; // Page actuelle
  pageSize: number = 5; // Taille de la page
  totalPages: number = 0; // Nombre total de pages
  totalElements: number = 0; // Nombre total d'éléments
  currentView: string = 'list'; // Vue actuelle ('list' ou 'add')
  statsByStatus = { enAttente: 0, enCours: 0, resolu: 0, total: 0 }; // Statistiques par statut
  filterStatus: string = ''; // Filtre par statut
  searchTerm: string = ''; // Terme de recherche
  sortField: string = 'dateSubmitted'; // Champ de tri
  sortDirection: string = 'desc'; // Direction du tri

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations(); // Charger les réclamations au démarrage
    //this.loadStats(); // Charger les statistiques
  }

  // Charger les réclamations avec pagination et filtres
  loadReclamations(): void {
    this.reclamationService.getReclamationsWithPagination(
      this.currentPage,
      this.pageSize,
      this.filterStatus,
      this.searchTerm,
      undefined, // Filtre description non utilisé pour l'instant
      this.sortField,
      this.sortDirection as 'asc' | 'desc'
    ).subscribe({
      next: (response) => {
        this.reclamations = response.content ?? [];
        this.filteredReclamations = [...this.reclamations]; // Copie pour affichage
        this.totalPages = response.totalPages ?? 0;
        this.totalElements = response.totalElements ?? 0;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des réclamations : ' + err.message;
      }
    });
  }

 
  // Validation des champs de la réclamation
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

  // Ajouter une nouvelle réclamation
  addReclamation(): void {
    if (this.validateReclamation(this.newReclamation)) {
      this.newReclamation.status = 'En attente'; // Statut forcé à "En attente"
      this.reclamationService.addReclamation(this.newReclamation).subscribe({
        next: () => {
          this.successMessage = 'Réclamation ajoutée avec succès !';
          this.loadReclamations();
          //this.loadStats();
          this.resetForm();
          this.showList(); // Revenir à la liste après ajout
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout : ' + err.message;
        }
      });
    }
  }

  // Sélectionner une réclamation pour modification
  editReclamation(reclamation: Reclamation): void {
    this.selectedReclamation = { ...reclamation }; // Copie pour modification
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Mettre à jour une réclamation
  updateReclamation(): void {
    if (this.selectedReclamation && this.selectedReclamation.id && this.validateReclamation(this.selectedReclamation)) {
      this.reclamationService.updateReclamation(this.selectedReclamation.id, this.selectedReclamation).subscribe({
        next: () => {
          this.successMessage = 'Réclamation mise à jour avec succès !';
          this.loadReclamations();
          //this.loadStats();
          this.selectedReclamation = undefined; // Fermer le formulaire
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour : ' + err.message;
        }
      });
    }
  }

  // Supprimer une réclamation
  deleteReclamation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.reclamationService.deleteReclamation(id).subscribe({
        next: () => {
          this.successMessage = 'Réclamation supprimée avec succès !';
          this.loadReclamations();
          //this.loadStats();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression : ' + err.message;
        }
      });
    }
  }

  // Afficher la liste des réclamations
  showList(): void {
    this.currentView = 'list';
    this.resetForm();
  }

  // Afficher le formulaire d'ajout
  showAddForm(): void {
    this.currentView = 'add';
    this.selectedReclamation = undefined;
  }

  // Gestion de la recherche
  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Réinitialiser la page lors d'une nouvelle recherche
    this.loadReclamations();
  }

  // Filtrer par statut
  selectStatus(status: string): void {
    this.filterStatus = status;
    this.currentPage = 0; // Réinitialiser la page lors d'un nouveau filtre
    this.loadReclamations();
  }

  // Trier les réclamations
  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadReclamations();
  }

  // Contrôles de pagination
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

  // Réinitialiser le formulaire d'ajout
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

  // Annuler la modification
  cancelEdit(): void {
    this.selectedReclamation = undefined;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Exporter en PDF
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
      }
    });
  }

  // Exporter en Excel
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
      }
    });
  }}