// src/app/front-office/applied/applied.component.ts
import { Component, OnInit } from '@angular/core';
import { OffreService } from '../services/offre.service';
import { Application, Offre } from '../Models/offre.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-applied',
  templateUrl: './applied.component.html',
  styleUrls: ['./applied.component.css']
})
export class AppliedComponent implements OnInit {
  appliedOffres: Offre[] = [];
  loading: boolean = true;
  error: string | null = null;
  staticStudentId: number = 123;

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadAppliedOffers();
  }

  loadAppliedOffers(): void {
    this.offreService.getApplications(this.staticStudentId).subscribe({
      next: (applications: Application[]) => {
        console.log('Applications fetched:', applications);
        this.appliedOffres = applications.map(app => app.offre);
        console.log('Applied offers:', this.appliedOffres);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching applications:', err);
        this.loading = false;
        this.error = 'Failed to load applied offers.';
      }
    });
  }

  // Optional: Uncomment if you want to allow withdrawing applications
  /*
  removeApplication(offer: Offre): void {
    if (!this.staticStudentId || !offer || !offer.id) {
      console.warn('Invalid student ID or offer provided');
      return;
    }

    const applicationData = {
      studentId: this.staticStudentId,
      offerId: offer.id
    };

    this.offreService.removeApplication(applicationData).subscribe({
      next: () => {
        console.log('Application removed successfully');
        this.appliedOffres = this.appliedOffres.filter(app => app.id !== offer.id);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error removing application:', error);
        this.error = 'Failed to remove application.';
      }
    });
  }
  */
}