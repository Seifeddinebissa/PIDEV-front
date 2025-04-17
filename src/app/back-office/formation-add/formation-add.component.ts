import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormationService } from '../services/formation.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-formation-add',
  templateUrl: './formation-add.component.html',
  styleUrls: ['./formation-add.component.css']
})
export class FormationAddComponent {
  formationForm: FormGroup;
  selectedImage: File | null = null; // Pour stocker le fichier image sélectionné

  constructor(
    private router: Router,
    private formationService: FormationService,
    private fb: FormBuilder
  ) {
    this.formationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), this.mustContainLetter()]],
      description: ['', [Validators.required, this.mustContainLetter()]],
      duration: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      is_public: [true, Validators.required]
    });
  }

  // Gestion du changement de fichier
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  addFormation(): void {
    if (this.formationForm.invalid || !this.selectedImage) {
      this.formationForm.markAllAsTouched();
      console.error('Formulaire invalide ou image manquante');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.formationForm.get('title')?.value);
    formData.append('description', this.formationForm.get('description')?.value);
    formData.append('duration', this.formationForm.get('duration')?.value.toString());
    formData.append('price', this.formationForm.get('price')?.value.toString());
    formData.append('is_public', this.formationForm.get('is_public')?.value.toString());
    formData.append('image', this.selectedImage);

    this.formationService.addFormationWithImage(formData).subscribe(
      (response) => {
        console.log('Formation ajoutée avec succès :', response);
        this.router.navigate(['/formations']);
      },
      (error) => {
        console.error('Erreur lors de l’ajout de la formation :', error);
      }
    );
  }
  // Custom validator to ensure the title contains at least one letter
  mustContainLetter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null; // Let Validators.required handle empty values
      }
      const hasLetter = /[a-zA-Z]/.test(value); // Check for at least one letter
      return hasLetter ? null : { noLetter: { value: control.value } };
    };
  }
}