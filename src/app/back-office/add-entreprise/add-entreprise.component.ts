// src/app/front-office/add-entreprise/add-entreprise.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntrepriseService } from '../services/entreprise.service'; // Assuming this service exists
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
  selectedFile: File | null = null; // Store the selected image file

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
      logo: [null],
      latitude: [null, Validators.required], // Add required validation
      longitude: [null, Validators.required] // Not part of reactive form validation since file input is handled separately
    });
  }

  // Getter for easy access to form fields
  get f() { return this.entrepriseForm.controls; }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop if the form is invalid or no file is selected
    if (this.entrepriseForm.invalid || !this.selectedFile) {
      this.errorMessage = !this.selectedFile ? 'Please select a logo image.' : 'Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Create FormData for multipart request
    const formData = new FormData();
    formData.append('name', this.f['name'].value);
    formData.append('sector', this.f['sector'].value);
    formData.append('location', this.f['location'].value);
    formData.append('description', this.f['description'].value);
    formData.append('email', this.f['email'].value);
    formData.append('phone', this.f['phone'].value);
    formData.append('website', this.f['website'].value);
    formData.append('logo', this.selectedFile);
    formData.append('latitude', this.f['latitude'].value);
    formData.append('longitude', this.f['longitude'].value);


    // Call the service to create the entreprise with image
    this.entrepriseService.addEntreprise(formData).subscribe({
      next: (response) => {
        console.log('Entreprise created:', response);
        this.loading = false;
        this.entrepriseForm.reset();
        this.selectedFile = null; // Reset file input
        this.submitted = false;
        this.router.navigate(['entreprises']);
      },
      error: (error) => {
        console.error('Error creating entreprise:', error);
        this.errorMessage = error.message || 'Failed to create entreprise. Please try again.';
        this.loading = false;
      }
    });
  }
}