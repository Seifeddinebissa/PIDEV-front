import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Router } from '@angular/router'; // Importation du Router

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  listCours: any[] = [];// Liste des cours typée comme tableau


  filteredCours: any[] = []; // Liste filtrée pour l'affichage
  searchTerm: string = ''; // Terme de recherche
  

  constructor(
    private service: CoursesService,
    private router: Router // Injection du Router dans le constructeur
  ) {}

  ngOnInit(): void {
    this.loadCours(); // Charge la liste des cours au démarrage
  }

  loadCours(): void {
    this.service.getAllCours().subscribe({
      next: (data) => {
        this.listCours = data;
        this.filteredCours = data;
        console.log('Liste des cours récupérée :', this.listCours);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des cours :', error);
      }
    });
  }

  deleteCours(idCours: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) { // Confirmation avant suppression
      this.service.deleteCours(idCours).subscribe({
        next: () => {
          this.listCours = this.listCours.filter(cours => cours.idCours !== idCours); // Met à jour la liste localement
          alert('Cours supprimé avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du cours:', error);
          alert('Erreur lors de la suppression du cours.');
        }
      });
    }
  }



  filterCourses(): void {
    // Filtrer les cours en fonction du searchTerm
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredCours = [...this.listCours]; // Si vide, afficher tous les cours
    } else {
      this.filteredCours = this.listCours.filter(cours =>
        cours.titre.toLowerCase().startsWith(this.searchTerm.trim().toLowerCase())
      );
    }
    
    
  }

  
}