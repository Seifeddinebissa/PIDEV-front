import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntrepriseService } from '../services/entreprise.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-entreprise',
  templateUrl: './add-entreprise.component.html',
  styleUrls: ['./add-entreprise.component.css']
})
export class AddEntrepriseComponent implements OnInit {
  entrepriseForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private entrepriseService: EntrepriseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.entrepriseForm = this.fb.group({
      name: ['', Validators.required],
      sector: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: ['', Validators.required],
    });
  }

  // Getter for easy access to form fields
  get f() { return this.entrepriseForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.entrepriseForm.invalid) {
      return;
    }

    this.loading = true;

    // Call the service to create the entreprise
    this.entrepriseService.addEntreprise(this.entrepriseForm.value).subscribe(
      (response) => {
        console.log('Entreprise created:', response);
        this.loading = false;
        this.entrepriseForm.reset();
        this.submitted = false;

        // Optionally, navigate to another page
        this.router.navigate(['entreprises']);
      },
      (error) => {
        console.error('Error creating entreprise:', error);
        this.errorMessage = 'Failed to create entreprise. Please try again.';
        this.loading = false;
      }
    );
  }
}
