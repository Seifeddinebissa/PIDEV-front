import { Component } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {
  course: Cours = new Cours();
  selectedFile?: File; // For the image
  photoPreview: string = '';
  selectedPdfs: File[] = []; // Array to hold multiple PDFs
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private coursesService: CoursesService, private router: Router) {}

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  triggerPdfInput(): void {
    const pdfInput = document.getElementById('pdfInput') as HTMLInputElement;
    pdfInput?.click();
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
      this.selectedPdfs = [...this.selectedPdfs, ...newPdfs]; // Ajoute les nouveaux PDFs sans écraser les précédents
      input.value = ''; // Réinitialise l'input pour permettre de resélectionner les mêmes fichiers si besoin
    }
  }

  removePdf(pdfToRemove: File): void {
    this.selectedPdfs = this.selectedPdfs.filter(pdf => pdf !== pdfToRemove); // Supprime le PDF sélectionné
  }

  onSubmit(): void {
    if (!this.course.titre || !this.course.description) {
      this.errorMessage = 'Title and description are required!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.coursesService.addCours(this.course.titre, this.course.description, this.selectedFile, this.selectedPdfs)
      .subscribe({
        next: (response) => {
          console.log('Course added successfully:', response);
          this.isLoading = false;
          alert('Course added successfully!');
          this.router.navigate(['/courses']);
        },
        error: (error) => {
          console.error('Error adding course:', error);
          this.isLoading = false;
          this.errorMessage = 'Error adding course: ' + (error.message || 'Unknown error');
        }
      });
  }

  resetForm(): void {
    this.course = new Cours();
    this.selectedFile = undefined;
    this.photoPreview = '';
    this.selectedPdfs = []; // Reset PDFs
    this.errorMessage = '';
  }
}

export class Cours {
  titre: string = '';
  description: string = '';
  image?: string;
  contenu?: string[];
}