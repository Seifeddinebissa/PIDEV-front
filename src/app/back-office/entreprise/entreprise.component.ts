import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../services/entreprise.service';
import { Entreprise } from '../models/Entreprise';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.css']
})
export class EntrepriseComponent implements OnInit {
  entreprises: any[] = []; // Original list of entreprises
  filteredEntreprises: any[] = []; // Filtered list based on search
  searchTerm: string = ''; // Two-way bound search input
  loading: boolean = true; // To indicate data is being fetched
  error: string = ''; // To display any loading errors
  
  filterEntreprises(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredEntreprises = [...this.entreprises]; // Reset to full list if search is empty
      return;
    }

    this.filteredEntreprises = this.entreprises.filter(entreprise =>
      (entreprise.name?.toLowerCase().includes(term) || '') ||
      (entreprise.email?.toLowerCase().includes(term) || '')
    );
  }
  
  deleteEntreprise(id: number): void {
    if (confirm('Are you sure you want to delete this entreprise?')) {
      this.entrepriseService.deleteEntreprise(id).subscribe({
        next: (response: string) => { // Expect string response
          this.entreprises = this.entreprises.filter(ent => ent.id !== id);
          console.log(response); // "Entreprise deleted successfully"
        },
        error: (error) => {
          console.error('Error deleting entreprise', error);
        }
      });
    }
  }
  
editEntreprise(entreprise: Entreprise): void {
  console.log("Navigating to Edit Page with ID:", entreprise.id); // Debugging Log
  this.router.navigate([`/update-entreprise/${entreprise.id}`]);
}
  

  constructor(private entrepriseService: EntrepriseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntreprises();
  }

  loadEntreprises(): void {
    this.loading = true; // Show loading state
    this.error = ''; // Reset error message
    this.entrepriseService.getEntreprises().subscribe({
      next: (data) => {
        this.entreprises = data || []; // Ensure entreprises is an array even if data is null
        this.filteredEntreprises = [...this.entreprises]; // Initialize filtered list
        this.loading = false; // Data loaded successfully
      },
      error: (err) => {
        this.error = 'Failed to load entreprises. Please try again later.';
        this.loading = false;
        console.error('Error loading entreprises:', err);
      }
    });
  }
}
