import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormationService } from '../services/formation.service'; // Import du service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formation-add',
  templateUrl: './formation-add.component.html',
  styleUrls: ['./formation-add.component.css']
})
export class FormationAddComponent {
  formationForm: FormGroup;

  constructor(
    private router: Router,
    private formationService: FormationService,
    private fb: FormBuilder
  ) {
    this.formationForm = this.fb.group({
      image: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      is_public: [true, Validators.required]
    });
  }

  addFormation() {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      return;
    }

    this.formationService.addFormation(this.formationForm.value).subscribe(
      (response) => {
        console.log('Formation ajoutée avec succès :', response);
        this.router.navigate(['/formations']); // Redirection après ajout
      },
      (error) => {
        console.error('Erreur lors de l’ajout de la formation :', error);
      }
    );
  }
}