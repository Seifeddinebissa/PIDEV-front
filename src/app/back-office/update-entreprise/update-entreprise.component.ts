import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepriseService } from '../services/entreprise.service';

@Component({
  selector: 'app-update-entreprise',
  templateUrl: './update-entreprise.component.html',
  styleUrls: ['./update-entreprise.component.css'],
})
export class UpdateEntrepriseComponent implements OnInit {
  entrepriseForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string = '';
  successMessage: string = ''; // Added for success feedback
  entrepriseId!: number;
  showModal = false; // For modal visibility

  constructor(
    private formBuilder: FormBuilder,
    private entrepriseService: EntrepriseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.entrepriseForm = this.formBuilder.group({
      name: ['', Validators.required],
      sector: ['', Validators.required],
      location: [''],
      description: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
    });

    // Check if we're navigating directly with an ID (optional for standalone page use)
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      this.entrepriseId = +idFromRoute;
      this.getEntrepriseDetails(this.entrepriseId);
      this.showModal = true; // Auto-open modal if navigated directly
    }
  }

  get f() {
    return this.entrepriseForm.controls;
  }

  // Method to fetch entreprise details by ID
  getEntrepriseDetails(id: number): void {
    this.entrepriseService.getEntrepriseById(id).subscribe({
      next: (data) => {
        this.entrepriseForm.patchValue(data);
      },
      error: (error) => {
        this.errorMessage = 'Error fetching entreprise data';
        console.error(error);
      }
    });
  }

  // Method to open modal programmatically (e.g., from another component)
  openModal(entreprise: any): void {
    this.showModal = true;
    this.entrepriseId = entreprise.id;
    this.entrepriseForm.patchValue(entreprise);
  }

  // Method to close modal
  closeModal(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showModal = false;
    this.submitted = false;
    this.loading = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.entrepriseForm.reset();

    // Navigate back to the list if not already there
    if (this.router.url.includes('/update-entreprise')) {
      this.router.navigate(['/entreprises']);
    }
  }

  // Method to handle form submission
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.entrepriseForm.invalid) {
      return;
    }

    this.loading = true;
    this.entrepriseService
      .updateEntreprise(this.entrepriseId, this.entrepriseForm.value)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Entreprise updated successfully!';
          setTimeout(() => {
            this.closeModal(); // Close modal and navigate
          }, 1000); // Brief delay to show success message
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error updating entreprise';
          console.error(error);
        }
      });
  }
}