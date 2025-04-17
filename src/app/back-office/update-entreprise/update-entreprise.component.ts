// src/app/front-office/update-entreprise/update-entreprise.component.ts
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
  successMessage: string = '';
  entrepriseId!: number;
  showModal = false;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private entrepriseService: EntrepriseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.entrepriseForm = this.formBuilder.group({
      name: ['', Validators.required],
      sector: ['', Validators.required],
      location: [''],
      description: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      latitude: [], // Add required validation
      longitude: [], // Not part of reactive form validation since file input is handled separately
      website: [],
    });

    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      this.entrepriseId = +idFromRoute;
      this.getEntrepriseDetails(this.entrepriseId);
      this.showModal = true;
    }
  }

  get f() {
    return this.entrepriseForm.controls;
  }

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

  openModal(entreprise: any): void {
    this.showModal = true;
    this.entrepriseId = entreprise.id;
    this.entrepriseForm.patchValue(entreprise);
  }

  closeModal(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showModal = false;
    this.submitted = false;
    this.loading = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedFile = null;
    this.entrepriseForm.reset();

    if (this.router.url.includes('/update-entreprise')) {
      this.router.navigate(['/entreprises']);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    //MS MS
    console.log('entreprise form', this.entrepriseForm);
    
    if (this.entrepriseForm.invalid) {
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.f['name'].value);
    formData.append('sector', this.f['sector'].value);
    formData.append('location', this.f['location'].value || '');
    formData.append('latitude', this.f['latitude'].value);
    formData.append('longitude', this.f['longitude'].value);
    formData.append('description', this.f['description'].value || '');
    formData.append('email', this.f['email'].value);
    formData.append('phone', this.f['phone'].value || '');
    formData.append('website', this.f['website'].value || '');
    //MS MS
    console.log('selected file. ', this.selectedFile);
    console.log('form data, ', formData);
    
    if (this.selectedFile) {
      //MS MS 
      console.log('IM IN');
      
      formData.append('logo', this.selectedFile);
    }

    // Debug FormData contents
    for (let pair of (formData as any).entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    this.entrepriseService.updateEntreprise(this.entrepriseId, formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Entreprise updated successfully!';
        setTimeout(() => {
          this.closeModal();
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error updating entreprise: ' + (error.message || 'Unknown error');
        console.error(error);
      }
    });
  }
}