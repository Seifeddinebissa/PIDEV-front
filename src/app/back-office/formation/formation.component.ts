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
  filteredFormation: any[] = []; // For filtered results
  searchQuery: string = ''; // Bind to the input field

  constructor(private service: FormationService, private router: Router) {}

  ngOnInit(): void {
    this.service.getAllFormation().subscribe(data => {
      console.log("Données reçues :", data); // Debugging data
      this.listFormation = data;
      this.filteredFormation = data; // Initially, set filteredFormation to all data
    },
    error => {
      console.error("Erreur de récupération :", error);
    });
  }

  searchCourses(): void {
    if (this.searchQuery.trim() === '') {
      // Si la recherche est vide, afficher toutes les formations
      this.filteredFormation = [...this.listFormation];
    } else {
      // Filtrer les formations dont le titre correspond à la requête
      this.filteredFormation = this.listFormation.filter(formation =>
        formation.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  deleteFormation(id: number, event: Event): void {
    event.preventDefault(); // Prevents the page from reloading
    if (confirm('Are you sure you want to delete this course?')) {
      this.service.deleteFormation(id).subscribe(() => {
        this.listFormation = this.listFormation.filter(f => f.id !== id);
        this.filteredFormation = this.filteredFormation.filter(f => f.id !== id);
      });
    }
  }

  addFormation(): void {
    this.router.navigate(['/formations/add']);
  }
}