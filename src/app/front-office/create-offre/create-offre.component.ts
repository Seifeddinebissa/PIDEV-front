import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffreService } from '../services/offre.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-offre',
  templateUrl: './create-offre.component.html',
  styleUrls: ['./create-offre.component.css']
})
export class CreateOffreComponent implements OnInit {
  offreForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private offreService: OffreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offreForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      datePosted: ['', Validators.required],
      dateExpiration: ['', Validators.required],
      contractType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      jobFunction: ['', Validators.required],
      jobType: ['', Validators.required],
      jobShift: ['', Validators.required],
      jobSchedule: ['', Validators.required],
      educationLevel: ['', Validators.required],
      entrepriseId: ['', Validators.required] // Ensure entrepriseId is filled
    });
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.offreForm.invalid) {
      return;
    }
  
    this.loading = true; // Start loading
  
    this.offreService.createOffre(this.offreForm.value).subscribe(
      (response) => {
        console.log('Offer created:', response);
        this.loading = false; // Stop loading
        this.offreForm.reset(); // Reset the form
        this.submitted = false; // Reset validation state
  
        // Optionally, navigate to another page
        this.router.navigate(['offre']);
      },
      (error) => {
        console.error('Error creating offer:', error);
        this.errorMessage = 'Failed to create offer. Please try again.';
        this.loading = false; // Stop loading
      }
    );
  }
}
