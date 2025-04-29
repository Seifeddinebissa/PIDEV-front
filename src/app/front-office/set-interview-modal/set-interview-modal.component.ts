import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreService } from '../services/offre.service';

@Component({
  selector: 'app-set-interview',
  templateUrl: './set-interview-modal.component.html',
  styleUrls: ['./set-interview-modal.component.css']
})
export class SetInterviewModalComponent implements OnInit {
  interviewForm!: FormGroup;
  applicationId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('Application ID is missing in the route parameters.');
      this.router.navigate(['/apply-entreprise']);
      return;
    }

    this.applicationId = +idParam;
    this.interviewForm = this.fb.group({
      interviewDate: ['', [Validators.required, this.futureDateValidator]],
      interviewLink: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  // ✅ Custom validator to ensure date is in the future
  futureDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const inputDate = new Date(control.value);
    const now = new Date();
    return inputDate < now ? { pastDate: true } : null;
  }

  onSubmit(): void {
    if (this.interviewForm.valid) {
      const { interviewDate, interviewLink } = this.interviewForm.value;
      this.offreService.scheduleInterview(this.applicationId, interviewDate, interviewLink).subscribe(
        () => {
          alert('Interview scheduled successfully');
          this.router.navigate(['/apply-entreprise']);
        },
        (error) => {
          console.error('Error scheduling interview:', error);
          alert(`Failed to schedule interview: ${error.message || 'Unknown error'}`);
        }
      );
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }

  goBack(): void {
    this.router.navigate(['/apply-entreprise']);
  }
}
