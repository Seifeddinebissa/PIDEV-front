import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../models/Reclamation';
import { ReclamationService } from '../services/reclamation.service';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  errorMessage: string = 'Please fill all required fields correctly';
  successMessage: string = 'Complaint added successfully!';
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  filterStatus: string = '';
  searchTerm: string = '';
  currentView: 'list' | 'add' = 'list';
  statsByStatus: { enAttente: number, enCours: number, resolu: number, total: number } = {
    enAttente: 0,
    enCours: 0,
    resolu: 0,
    total: 0
  };
  sortField: string = 'dateSubmitted';
  sortDirection: 'asc' | 'desc' = 'asc';
  isSpeaking: boolean = false;
  selectedFile: File | null = null;
  selectedReclamationForSolution: Reclamation | null = null;
  loadingReclamationIds: number[] = [];
  showPdfViewer: boolean = false;
  selectedPdfUrl: SafeResourceUrl | null = null;

  constructor(
    private reclamationService: ReclamationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
    this.loadStats();
  }

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
        this.reclamations = response.content ?? [];
        this.totalPages = response.totalPages ?? 0;
        this.totalElements = response.totalElements ?? 0;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des réclamations';
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

 /* loadStats(): void {
    this.reclamationService.getStatsByStatus().subscribe({
      next: (stats) => {
        this.statsByStatus.enAttente = stats['En attente'] || stats['en attente'] || 0;
        this.statsByStatus.enCours = stats['En cours'] || stats['en cours'] || 0;
        this.statsByStatus.resolu = stats['Résolu'] || stats['résolu'] || 0;
        this.statsByStatus.total = stats['total'] || 0;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des statistiques';
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }
*/
  // Charger les statistiques depuis lâ€™API
  loadStats(): void {
    console.log('Attempting to load statistics');
    this.reclamationService.getStatsByStatus().subscribe({
      next: (stats) => {
        console.log("Statistics received:", stats);
        this.statsByStatus.enAttente = stats['Pending'] || stats['en attente'] || 0;
        this.statsByStatus.enCours = stats['In Progress'] || stats['en cours'] || 0;
        this.statsByStatus.resolu = stats['Resolved'] || stats['rÃ©solu'] || 0;
        this.statsByStatus.total = stats['total'] || 0;
        console.log("Updated statistics:", this.statsByStatus);
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.errorMessage = 'Error loading statistics';
      }
    });
  }


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

  applyFilters(): void {
    this.currentPage = 0;
    this.loadReclamations();
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  selectStatus(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  sort(column: string): void {
    if (this.sortField === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column;
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

  validateReclamation(reclamation: Reclamation): boolean {
    if (!reclamation.subject.trim() || !reclamation.description.trim()) {
      this.errorMessage = '❗ Tous les champs sont requis.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

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
          this.errorMessage = 'Erreur lors de l\'ajout de la réclamation';
          setTimeout(() => (this.errorMessage = ''), 5000);
        }
      });
    }
  }

  deleteReclamation(id: number): void {
    this.reclamationService.deleteReclamation(id).subscribe({
      next: () => {
        this.loadReclamations();
        this.loadStats();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression de la réclamation';
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  editReclamation(reclamation: Reclamation): void {
    this.selectedReclamation = { ...reclamation };
  }

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
            this.errorMessage = 'Erreur lors de la mise à jour de la réclamation';
            setTimeout(() => (this.errorMessage = ''), 5000);
          }
        });
      }
    }
  }

  resetForm(): void {
    this.newReclamation = { subject: '', description: '', dateSubmitted: new Date(), status: 'En attente' };
    this.errorMessage = '';
  }

  showAddForm(): void {
    this.currentView = 'add';
    this.selectedReclamation = undefined;
  }

  showList(): void {
    this.currentView = 'list';
  }

  cancelEdit(): void {
    this.selectedReclamation = undefined;
    this.successMessage = '';
    this.errorMessage = '';
  }

  exportToPDF(): void {
    this.reclamationService.exportToPDF().subscribe({
      next: (blob: Blob) => {
        saveAs(blob, 'reclamations.pdf');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'exportation en PDF';
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  exportToExcel(): void {
    this.reclamationService.exportToExcel().subscribe({
      next: (blob: Blob) => {
        saveAs(blob, 'reclamations.xlsx');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'exportation en Excel';
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  readReclamation(reclamation: Reclamation): void {
    if ('speechSynthesis' in window) {
      this.stopSpeech();
      const text = `Sujet: ${reclamation.subject}. Description: ${reclamation.description}. Statut: ${reclamation.status}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.onstart = () => this.isSpeaking = true;
      utterance.onend = () => this.isSpeaking = false;
      window.speechSynthesis.speak(utterance);
    } else {
      this.errorMessage = 'La synthèse vocale n\'est pas supportée par votre navigateur.';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }

  readAllReclamations(): void {
    if ('speechSynthesis' in window) {
      this.stopSpeech();
      const text = this.reclamations.map(r => 
        `Sujet: ${r.subject}. Description: ${r.description}. Statut: ${r.status}.`
      ).join(' ');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.onstart = () => this.isSpeaking = true;
      utterance.onend = () => this.isSpeaking = false;
      window.speechSynthesis.speak(utterance);
    } else {
      this.errorMessage = 'La synthèse vocale n\'est pas supportée par votre navigateur.';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }

  stopSpeech(): void {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  selectReclamationForSolution(reclamation: Reclamation): void {
    this.selectedReclamationForSolution = reclamation;
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelSolutionUpload(): void {
    this.selectedReclamationForSolution = null;
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSolutionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Le fichier ne doit pas dépasser 5 Mo.';
          this.selectedFile = null;
        } else {
          this.selectedFile = file;
          this.errorMessage = '';
        }
      } else {
        this.errorMessage = 'Veuillez sélectionner un fichier PDF valide.';
        this.selectedFile = null;
      }
    }
  }

  uploadSolution(): void {
    if (this.selectedReclamationForSolution && this.selectedReclamationForSolution.id && this.selectedFile) {
      this.reclamationService.uploadSolution(this.selectedReclamationForSolution.id, this.selectedFile).subscribe({
        next: () => {
          this.successMessage = 'Solution PDF téléversée avec succès !';
          this.errorMessage = '';
          this.selectedFile = null;
          this.selectedReclamationForSolution = null;
          this.loadReclamations();
        },
        error: (err) => {
          this.errorMessage = err.status === 400 
            ? 'Fichier invalide ou réclamation non trouvée.'
            : 'Erreur lors du téléversement de la solution PDF.';
          this.successMessage = '';
          setTimeout(() => (this.errorMessage = ''), 5000);
        }
      });
    } else {
      this.errorMessage = 'Aucun fichier ou réclamation sélectionné.';
      this.successMessage = '';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }
/*
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
        this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solution_${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

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
  }*/
}