import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffreService } from '../services/offre.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  idEntreprise!: number;

  constructor(
    private fb: FormBuilder,
    private offreService: OffreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Debugging route information
    console.log('Current URL:', this.router.url);
    console.log('Route snapshot:', this.route.snapshot);
    console.log('ParamMap keys:', this.route.snapshot.paramMap.keys);
    const idFromUrl = this.route.snapshot.paramMap.get('idEntreprise');
    console.log('Raw idEntreprise from paramMap:', idFromUrl);

    // Handle the idEntreprise retrieval
    if (!idFromUrl) {
      console.error('idEntreprise is null or missing from URL');
      this.errorMessage = 'No enterprise ID provided.';
      this.idEntreprise = 0; // Default value or handle differently
    } else {
      this.idEntreprise = Number(idFromUrl);
      console.log('Retrieved idEntreprise:', this.idEntreprise);
    }

    // Fix duplicate dateExpiration and initialize form
    const currentDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    this.offreForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      salary: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)],],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      datePosted: [{ value: currentDate, disabled: true }, [Validators.required]],
      dateExpiration: ['', Validators.required], // Removed duplicate
      contractType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      jobFunction: ['', Validators.required],
      jobType: ['', Validators.required],
      jobShift: ['', Validators.required],
      jobSchedule: ['', Validators.required],
      educationLevel: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(form: FormGroup) {
    const datePosted = form.get('datePosted')?.value;
    const dateExpiration = form.get('dateExpiration')?.value;
    if (datePosted && dateExpiration && new Date(dateExpiration) <= new Date(datePosted)) {
      return { invalidDateRange: true };
    }
    return null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.offreForm.invalid) {
      console.log('Form invalid:', this.offreForm.errors);
      return;
    }

    this.loading = true;
    this.errorMessage = ''; // Clear previous errors

    // Use getRawValue() to include disabled fields like datePosted
    const formData = {
      ...this.offreForm.getRawValue(),
      entreprise: { id: this.idEntreprise }
    };

    this.offreService.createOffre(formData).subscribe(
      (response) => {
        console.log('Offer created:', response);
        this.loading = false;
        this.submitted = false;
        // Reset form while preserving datePosted
        this.offreForm.reset({ datePosted: new Date().toISOString().split('T')[0] });
        this.router.navigate(['offre']);
      },
      (error) => {
        console.error('Error creating offer:', error);
        this.errorMessage = 'Failed to create offer. Please try again.';
        this.loading = false;
      }
    );
  }
}