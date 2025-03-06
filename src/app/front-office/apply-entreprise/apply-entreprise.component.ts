import { Component } from '@angular/core';
import { Offre, OffreService } from '../services/offre.service';
import { Application } from '../Models/offre.model';

@Component({
  selector: 'app-apply-entreprise',
  templateUrl: './apply-entreprise.component.html',
  styleUrls: ['./apply-entreprise.component.css']
})
export class ApplyEntrepriseComponent {
AcceptApplication(_t16: Offre) {
throw new Error('Method not implemented.');
}
removeApplication(_t16: Offre) {
throw new Error('Method not implemented.');
}
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
}
