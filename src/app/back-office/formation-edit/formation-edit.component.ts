import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationService } from '../services/formation.service';
import { Formation } from '../models/Formation';

@Component({
  selector: 'app-formation-edit',
  templateUrl: './formation-edit.component.html',
  styleUrls: ['./formation-edit.component.css']
})
export class FormationEditComponent implements OnInit {
  formationForm: FormGroup;
  formationId: number;
  selectedImage: File | null = null; // Pour stocker une nouvelle image sélectionnée
  currentImageUrl: string | null = null; // Pour afficher l'image existante

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private formationService: FormationService,
    private router: Router
  ) {
    this.formationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      is_public: [true, Validators.required]
    });
    this.formationId = 0;
  }

  ngOnInit(): void {
    // Récupération de l'ID depuis l'URL
    this.formationId = +this.route.snapshot.paramMap.get('id')!;
    if (this.formationId) {
      this.formationService.getFormationById(this.formationId).subscribe(
        (data: Formation) => {
          this.formationForm.patchValue({
            title: data.title,
            description: data.description,
            duration: data.duration,
            price: data.price,
            is_public: data.is_public
          });
          this.currentImageUrl = data.image; // Charger l'image existante
        },
        (error) => {
          console.error('Erreur lors du chargement de la formation:', error);
        }
      );
    }
  }

  // Gestion du changement de fichier
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  // Mise à jour de la formation
  updateFormation(): void {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      console.log('Formulaire invalide:', this.formationForm.value);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.formationForm.get('title')?.value);
    formData.append('description', this.formationForm.get('description')?.value);
    formData.append('duration', this.formationForm.get('duration')?.value.toString());
    formData.append('price', this.formationForm.get('price')?.value.toString());
    formData.append('is_public', this.formationForm.get('is_public')?.value.toString());
    if (this.selectedImage) {
      formData.append('image', this.selectedImage); // Ajouter la nouvelle image si sélectionnée
    }

    this.formationService.updateFormationWithImage(this.formationId, formData).subscribe(
      (response) => {
        console.log('Formation mise à jour avec succès:', response);
        this.router.navigate(['/formations']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la formation:', error);
      }
    );
  }

  // Gestion des erreurs de chargement d'image
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/courses/default.jpg';
    console.warn('Image failed to load, using default image');
  }
}