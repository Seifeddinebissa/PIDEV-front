import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css']
})
export class UpdateCourseComponent implements OnInit {
  course: any = { idCours: null, titre: '', description: '', image: '', contenu: [] };
  selectedFile?: File;
  photoPreview: string = '';
  selectedPdfs: File[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idCours = this.route.snapshot.paramMap.get('id');
    if (idCours) {
      console.log('ID du cours détecté :', idCours);
      this.loadCourse(+idCours);
    } else {
      this.errorMessage = 'Aucun ID de cours détecté.';
      console.error('ID non trouvé dans l\'URL');
    }
  }


  loadCourse(idCours: number): void {
    this.coursesService.getCoursById(idCours).subscribe({
      next: (data) => {
        this.course = data;
        console.log('URL de l\'image récupérée depuis le backend :', this.course.image);
        this.photoPreview = this.course.image || '';
        console.log('PhotoPreview définie :', this.photoPreview);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du cours:', error);
        this.errorMessage = 'Impossible de charger le cours.';
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onPdfsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newPdfs = Array.from(input.files);
      this.selectedPdfs = [...this.selectedPdfs, ...newPdfs];
      input.value = '';
    }
  }

  removePdf(pdfToRemove: File): void {
    this.selectedPdfs = this.selectedPdfs.filter(pdf => pdf !== pdfToRemove);
  }

  removeExistingPdf(pdfUrlToRemove: string): void {
    this.course.contenu = this.course.contenu.filter((pdfUrl: string) => pdfUrl !== pdfUrlToRemove);
  }

  onSubmit(): void {
    if (!this.course.titre || !this.course.description) {
      this.errorMessage = 'Titre et description sont requis !';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Envoie la liste mise à jour des PDFs existants (course.contenu) et les nouveaux PDFs (selectedPdfs)
    this.coursesService.updateCours(
      this.course.idCours,
      this.course.titre,
      this.course.description,
      this.selectedFile,
      this.selectedPdfs,
      this.course.contenu
    ).subscribe({
      next: (response) => {
        console.log('Cours mis à jour avec succès:', response);
        this.isLoading = false;
        alert('Cours mis à jour avec succès !');
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du cours:', error);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la mise à jour : ' + (error.message || 'Erreur inconnue');
      }
    });
  }

  triggerPdfInput(): void {
    const pdfInput = document.getElementById('pdfInput') as HTMLInputElement;
    pdfInput?.click();
  }
}