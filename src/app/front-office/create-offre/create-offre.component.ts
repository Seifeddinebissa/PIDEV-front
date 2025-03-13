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
    this.idEntreprise = Number(this.route.snapshot.paramMap.get('idEntreprise'));
    console.log('Retrieved idEntreprise:', this.idEntreprise);

    const currentDate = new Date().toISOString().split('T')[0]; // Formats as 'YYYY-MM-DD'

    this.offreForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      salary: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      datePosted: [{ value: currentDate, disabled: true }, [Validators.required]], // Disabled and set to current date      dateExpiration: ['', Validators.required],
      contractType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      jobFunction: ['', Validators.required],
      jobType: ['', Validators.required],
      jobShift: ['', Validators.required],
      jobSchedule: ['', Validators.required],
      educationLevel: ['', Validators.required]}, { validators: this.dateRangeValidator });
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
    return;
  }

  this.loading = true; // Start loading

  // Attach entrepriseId to the form data
  const formData = {
    ...this.offreForm.value,
    entreprise: { id: this.idEntreprise }, // Pass the entrepriseId as a reference to Entreprise
  };

  this.offreService.createOffre(formData).subscribe(
    (response) => {
      console.log('Offer created:', response);
      this.loading = false;
      this.offreForm.reset();
      this.submitted = false;
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
