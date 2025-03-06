import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../models/Reclamation';
import { ReclamationService } from '../services/reclamation.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-listreclamation',
  templateUrl: './listreclamation.component.html',
  styleUrls: ['./listreclamation.component.css']
})
export class ListreclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  newReclamation: Reclamation = {
    subject: '',
    description: '',
    dateSubmitted: new Date(),
    status: 'En attente'
  };
  selectedReclamation?: Reclamation;
  errorMessage: string = '';

  // Pagination
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;

  // Filtres
  filterStatus: string = '';
  searchTerm: string = '';

  // Gestion de la vue
  currentView: 'list' | 'add' = 'list';

  // Statistiques par statut
  statsByStatus: { enAttente: number, enCours: number, resolu: number, total: number } = {
    enAttente: 0,
    enCours: 0,
    resolu: 0,
    total: 0
  };

  // Tri
  sortField: string = 'dateSubmitted';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Gestion de la lecture vocale
  isSpeaking: boolean = false;

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations();
    this.loadStats();
  }

  // Charger les réclamations avec pagination, filtres et tri
  loadReclamations(): void {
    const { subject, description } = this.parseSearchTerm(this.searchTerm);
    this.reclamationService.getReclamationsWithPagination(
      this.currentPage,
      this.pageSize,
      this.filterStatus.trim() || undefined,
      subject || undefined,
      description || undefined,
      this.sortField,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        console.log("Filtres et tri envoyés - Status:", this.filterStatus, "Subject:", subject, "Description:", description, "Sort:", this.sortField, "Direction:", this.sortDirection);
        console.log("Réponse reçue :", response);
        this.reclamations = response.content ?? [];
        this.totalPages = response.totalPages ?? 0;
        this.totalElements = response.totalElements ?? 0;
      },
      error: (err) => {
        console.error("Erreur de chargement :", err);
        this.errorMessage = 'Error while loading complaints';
      }
    });
  }

  // Charger les statistiques depuis l’API
  loadStats(): void {
    console.log('Attempting to load statistics');
    this.reclamationService.getStatsByStatus().subscribe({
      next: (stats) => {
        console.log("Statistics received:", stats);
        this.statsByStatus.enAttente = stats['En attente'] || stats['en attente'] || 0;
        this.statsByStatus.enCours = stats['En cours'] || stats['en cours'] || 0;
        this.statsByStatus.resolu = stats['Résolu'] || stats['résolu'] || 0;
        this.statsByStatus.total = stats['total'] || 0;
        console.log("Updated statistics:", this.statsByStatus);
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.errorMessage = 'Error loading statistics';
      }
    });
  }

  // Analyser le terme de recherche pour extraire subject et description
  parseSearchTerm(term: string): { subject?: string; description?: string } {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      return { subject: undefined, description: undefined };
    }
    const words = trimmedTerm.split(' ').filter(word => word.length > 0);
    if (words.length === 0) {
      return { subject: undefined, description: undefined };
    }
    const subject = words[0];
    const description = words.length > 1 ? words.slice(1).join(' ') : undefined;
    return { subject, description };
  }

  // Appliquer les filtres lors de la saisie ou changement de statut
  applyFilters(): void {
    this.currentPage = 0;
    this.loadReclamations();
  }

  // Gérer la saisie dans la barre de recherche
  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  // Sélectionner un statut via les boutons
  selectStatus(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  // Changer le tri pour une colonne spécifique
  sort(column: string): void {
    if (this.sortField === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column;
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

  // Validation d'une réclamation
  validateReclamation(reclamation: Reclamation): boolean {
    if (!reclamation.subject.trim() || !reclamation.description.trim()) {
      this.errorMessage = '❗ All fields are required.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  // Ajouter une réclamation
  addReclamation(): void {
    if (this.validateReclamation(this.newReclamation)) {
      this.reclamationService.addReclamation(this.newReclamation).subscribe({
        next: () => {
          this.loadReclamations();
          this.loadStats();
          this.resetForm();
          this.currentView = 'list';
        },
        error: (err) => {
          console.error("Error during addition:", err);
          this.errorMessage = 'Error adding complaint';
        }
      });
    }
  }

  // Supprimer une réclamation
  deleteReclamation(id: number): void {
    this.reclamationService.deleteReclamation(id).subscribe({
      next: () => {
        this.loadReclamations();
        this.loadStats();
      },
      error: (err) => {
        console.error("Error during deletion:", err);
        this.errorMessage = 'Error deleting complaint';
      }
    });
  }

  // Modifier une réclamation
  editReclamation(reclamation: Reclamation): void {
    this.selectedReclamation = { ...reclamation };
  }

  // Mettre à jour une réclamation
  updateReclamation(): void {
    if (this.selectedReclamation && this.selectedReclamation.id) {
      if (this.validateReclamation(this.selectedReclamation)) {
        this.reclamationService.updateReclamation(this.selectedReclamation.id, this.selectedReclamation).subscribe({
          next: () => {
            this.loadReclamations();
            this.loadStats();
            this.selectedReclamation = undefined;
            this.currentView = 'list';
          },
          error: (err) => {
            console.error("Error during update:", err);
            this.errorMessage = 'Error updating complaint';
          }
        });
      }
    }
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.newReclamation = { subject: '', description: '', dateSubmitted: new Date(), status: 'En attente' };
    this.errorMessage = '';
  }

  // Méthodes de navigation entre vues
  showAddForm(): void {
    this.currentView = 'add';
    this.selectedReclamation = undefined;
  }

  showList(): void {
    this.currentView = 'list';
  }

  // Exporter en PDF
  exportToPDF(): void {
    this.reclamationService.exportToPDF().subscribe({
      next: (blob: Blob) => {
        saveAs(blob, 'reclamations.pdf');
      },
      error: (err) => {
        console.error('Error exporting to PDF:', err);
        this.errorMessage = 'Error exporting to PDF';
      }
    });
  }

  // Exporter en Excel
  exportToExcel(): void {
    this.reclamationService.exportToExcel().subscribe({
      next: (blob: Blob) => {
        saveAs(blob, 'reclamations.xlsx');
      },
      error: (err) => {
        console.error('Error exporting to Excel:', err);
        this.errorMessage = 'Error exporting to Excel';
      }
    });
  }

  // Lire une réclamation spécifique à voix haute (sujet, description, statut uniquement)
  readReclamation(reclamation: Reclamation): void {
    if ('speechSynthesis' in window) {
      this.stopSpeech(); // Arrêter toute lecture en cours
      const text = `Subject: ${reclamation.subject}. Description: ${reclamation.description}. Status: ${reclamation.status}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Langue anglaise pour correspondre au template
      utterance.onstart = () => this.isSpeaking = true;
      utterance.onend = () => this.isSpeaking = false;
      window.speechSynthesis.speak(utterance);
    } else {
      this.errorMessage = 'Text-to-speech is not supported by your browser.';
    }
  }

  // Lire toutes les réclamations de la liste (sujet, description, statut uniquement)
  readAllReclamations(): void {
    if ('speechSynthesis' in window) {
      this.stopSpeech(); // Arrêter toute lecture en cours
      const text = this.reclamations.map(r => 
        `Subject: ${r.subject}. Description: ${r.description}. Status: ${r.status}.`
      ).join(' ');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Langue anglaise pour correspondre au template
      utterance.onstart = () => this.isSpeaking = true;
      utterance.onend = () => this.isSpeaking = false;
      window.speechSynthesis.speak(utterance);
    } else {
      this.errorMessage = 'Text-to-speech is not supported by your browser.';
    }
  }

  // Arrêter la lecture vocale
  stopSpeech(): void {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}