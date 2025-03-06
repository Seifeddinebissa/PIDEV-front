// src/app/front-office/update-offre/update-offre.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreService } from '../services/offre.service';
import { Offre } from '../Models/offre.model';

@Component({
  selector: 'app-update-offre',
  templateUrl: './update-offre-modal.component.html',
  styleUrls: ['./update-offre-modal.component.css']
})
export class UpdateOffreModalComponent implements OnInit {
  offreForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string = '';
  successMessage: string = '';
  offreId!: number;
  showModal = false;
  selectedOffre!: Offre;

  constructor(
    private formBuilder: FormBuilder,
    private offreService: OffreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offreForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(0)]], // Salary must be a number >= 0
      location: ['', Validators.required],
      datePosted: ['', Validators.required], // Ensure this is a valid date string
      dateExpiration: ['', Validators.required], // Ensure this is a valid date string
      contractType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      jobFunction: ['', Validators.required],
      jobType: ['', Validators.required],
      jobShift: [''], // Optional field
      jobSchedule: [''], // Optional field
      educationLevel: ['', Validators.required]
    });

    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      this.offreId = +idFromRoute;
      this.getOffreDetails(this.offreId);
      this.showModal = true;
    }
  }

  get f() {
    return this.offreForm.controls;
  }

  getOffreDetails(id: number): void {
    this.offreService.getOffreById(id).subscribe({
      next: (data: Offre) => {
        this.offreForm.patchValue({
          title: data.title,
          description: data.description,
          salary: data.salary,
          location: data.location,
          datePosted: data.datePosted,
          dateExpiration: data.dateExpiration,
          contractType: data.contractType,
          experienceLevel: data.experienceLevel,
          jobFunction: data.jobFunction,
          jobType: data.jobType,
          jobShift: data.jobShift || '',
          jobSchedule: data.jobSchedule || '',
          educationLevel: data.educationLevel
        });
      },
      error: (error) => {
        this.errorMessage = 'Error fetching offre data';
        console.error(error);
      }
    });
  }

  closeModal(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showModal = false;
    this.submitted = false;
    this.loading = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.offreForm.reset();

    if (this.router.url.includes('/update-offre-modal')) {
      this.router.navigate(['/offre']);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    if (this.offreForm.invalid) {
      return;
    }
  
    this.loading = true;
  
    const offreData: Offre = {
      id: this.offreId, // Use the ID from the route parameter
      title: this.f['title'].value,
      description: this.f['description'].value,
      salary: this.f['salary'].value,
      location: this.f['location'].value,
      datePosted: this.f['datePosted'].value,
      dateExpiration: this.f['dateExpiration'].value,
      contractType: this.f['contractType'].value,
      experienceLevel: this.f['experienceLevel'].value,
      jobFunction: this.f['jobFunction'].value,
      jobType: this.f['jobType'].value,
      jobShift: this.f['jobShift'].value || '',
      jobSchedule: this.f['jobSchedule'].value || '',
      educationLevel: this.f['educationLevel'].value,
      entrepriseId: this.offreForm.value.entrepriseId || 0, // Assuming entrepriseId is pre-filled
      favorites: [] // Initialize favorites as an empty array or fetch it if needed
    };
  
    this.offreService.updateOffre(this.offreId, offreData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Offre updated successfully!';
        setTimeout(() => {
          this.closeModal();
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error updating offre: ' + (error.message || 'Unknown error');
        console.error(error);
      }
    });
  }
  openModal(offre: Offre): void {
    this.showModal = true; // Show the modal
    this.offreId = offre.id;
    this.selectedOffre = offre; // Store the selected offer
  }

  
}