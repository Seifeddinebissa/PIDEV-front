import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css']
})
export class AdminCoursesComponent implements OnInit {

  listCours: any[] = []; // Liste complète des cours
 
  constructor(private service: CoursesService) {}

  ngOnInit(): void {
    this.loadCours();
  }

  loadCours(): void {
    this.service.getAllCours().subscribe({
      next: (data) => {
        this.listCours = data;
        console.log('Liste des cours récupérée :', this.listCours);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des cours :', error);
      }
    });
  }

  deleteCourse(idCours: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.service.deleteCours(idCours).subscribe({
        next: () => {
          // Supprime le cours de la liste localement après succès
          this.listCours = this.listCours.filter(course => course.idCours !== idCours);
          console.log('Cours supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du cours :', error);
        }
      });
    }
  }




}
