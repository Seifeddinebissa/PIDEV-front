import { Component, OnInit } from '@angular/core';
import { EntrepriseService} from '../services/entreprise.service';
import { Entreprise, PageResponse } from '../models/Entreprise';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

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
  baseUrl = 'http://localhost:8081';
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 0; // 0-based for Spring
  pageSize: number = 5;
  
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
        next: (response: string) => {
          console.log(response); // "Entreprise deleted successfully"
          this.loadEntreprises();  // Reload the list of entreprises after delete
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
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadEntreprises();
  }

  loadEntreprises(): void {
    this.entrepriseService.getEntreprises(this.currentPage, this.pageSize).subscribe({
      next: (page: PageResponse<Entreprise>) => {
        console.log('Raw paginated data:', page);
        this.entreprises = page.content;
        this.totalItems = page.totalElements;
        this.totalPages = page.totalPages;
        // Load logos for each entreprise
        this.entreprises.forEach((entreprise, index) => {
          if (entreprise.logo) {
            this.entrepriseService.getEntreprisesLogo(entreprise.logo).subscribe({
              next: (blob: Blob) => {
                const imageUrl = URL.createObjectURL(blob);
                entreprise.logo = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
                console.log(`Loaded logo for ${entreprise.name}: ${imageUrl}`);
                // Update filteredEntreprises to reflect the change
                this.filteredEntreprises[index] = entreprise;
              },
              error: (err) => {
                console.warn(`Failed to load logo for ${entreprise.name}: ${err}`);
                entreprise.logo = null;
                this.filteredEntreprises[index] = entreprise;
              }
            });
          }
        });
        this.filteredEntreprises = [...this.entreprises];
      },
      error: (err) => {
        console.error('Error loading entreprises:', err);
      }
    });
  }
    changePage(newPage: number): void {
      if (newPage >= 0 && newPage < this.totalPages) {
        this.currentPage = newPage;
        this.loadEntreprises();
      }
  }
  
  
 }

