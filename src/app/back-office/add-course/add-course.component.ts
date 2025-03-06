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
  selectedFile?: File;
  photoPreview: string = '';
  selectedPdfs: File[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  titleError: string = ''; // Message d'erreur pour le titre
  descriptionError: string = ''; // Message d'erreur pour la description

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
      this.selectedPdfs = [...this.selectedPdfs, ...newPdfs];
      input.value = '';
    }
  }

  removePdf(pdfToRemove: File): void {
    this.selectedPdfs = this.selectedPdfs.filter(pdf => pdf !== pdfToRemove);
  }

  
  // Validation du titre
  validateTitle(): boolean {
    const specialCharRegex = /[*<>%^$!~]/; // Interdit *, <, >, %
    if (!this.course.titre || this.course.titre.trim() === '') {
      this.titleError = 'Le titre est requis.';
      return false;
    } else if (this.course.titre.trim().length < 2) {
      this.titleError = 'Le titre doit contenir au moins 2 caractères.';
      return false;
    } else if (specialCharRegex.test(this.course.titre)) {
      this.titleError = 'Le titre ne doit pas contenir les caractères spéciaux *, <, > , % , $ ,^ ,! ou ~';
      return false;
    }
    this.titleError = '';
    return true;
  }

  // Validation de la description
  validateDescription(): boolean {
    const specialCharRegex = /[*<>%^$!~]/; // Interdit *, <, >, %
    if (!this.course.description || this.course.description.trim() === '') {
      this.descriptionError = 'La description est requise.';
      return false;
    } else if (this.course.description.trim().length < 10) {
      this.descriptionError = 'La description doit contenir au moins 10 caractères.';
      return false;
    } else if (specialCharRegex.test(this.course.description)) {
      this.descriptionError = 'La description ne doit pas contenir les caractères spéciaux *, <, > , % , $ ,^ ,! ou ~.';
      return false;
    }
    this.descriptionError = '';
    return true;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.titleError = '';
    this.descriptionError = '';

    // Vérifier les validations
    const isTitleValid = this.validateTitle();
    const isDescriptionValid = this.validateDescription();

    if (!isTitleValid || !isDescriptionValid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    this.isLoading = true;

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
          this.errorMessage = 'Erreur lors de l\'ajout du cours : ' + (error.message || 'Erreur inconnue');
        }
      });
  }

  resetForm(): void {
    this.course = new Cours();
    this.selectedFile = undefined;
    this.photoPreview = '';
    this.selectedPdfs = [];
    this.errorMessage = '';
    this.titleError = '';
    this.descriptionError = '';
  }
}

export class Cours {
  titre: string = '';
  description: string = '';
  image?: string;
  contenu?: string[];
}