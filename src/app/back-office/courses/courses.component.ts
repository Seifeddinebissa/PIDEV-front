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
  searchTitle: string = '';
  

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



  searchCourses(): void {
    if (this.searchTitle.trim() === '') {
      this.filteredCours = [...this.listCours];
    } else {
      this.service.getCoursByTitre(this.searchTitle).subscribe({
        next: (cours) => {
          this.filteredCours = cours ? [cours] : [];
          console.log('Résultat de la recherche :', this.filteredCours);
        },
        error: (error) => {
          console.error('Erreur lors de la recherche par titre :', error);
          this.filteredCours = [];
        }
      });
    }
  }

  
}