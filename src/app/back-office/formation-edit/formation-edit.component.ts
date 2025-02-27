import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../services/formation.service';
import { Formation } from '../models/Formation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import de FormBuilder, FormGroup et Validators

@Component({
  selector: 'app-formation-edit',
  templateUrl: './formation-edit.component.html',
  styleUrls: ['./formation-edit.component.css']
})
export class FormationEditComponent implements OnInit {
  formation: Formation = { id: 0, image:'', title: '', description: '', duration: 0, is_public: false, price: 0 };
  formationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private router: Router,
    private fb: FormBuilder // Utilisation du FormBuilder pour créer le formulaire
  ) {
    // Initialisation du formulaire avec les validations
    this.formationForm = this.fb.group({
      image: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      is_public: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.formationService.getFormationById(id).subscribe(data => {
        this.formation = data;
        // Remplissage du formulaire avec les données de la formation
        this.formationForm.patchValue(this.formation);
      });
    }
  }

  updateFormation(): void {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      return;
    }

    this.formationService.updateFormation(this.formation.id, this.formationForm.value).subscribe(() => {
      this.router.navigate(['/formations']); // Redirection après mise à jour
    });
  }
}