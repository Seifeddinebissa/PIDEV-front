import { Component, OnInit } from '@angular/core';
import { OffreService } from '../services/offre.service';
import { Offre } from '../Models/offre.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateOffreModalComponent } from 'src/app/front-office/update-offre-modal/update-offre-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offre',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  offres: Offre[] = [];
  fetchingOffers: boolean = true;
  updatingOffer: boolean = false;
  deletingOffer: boolean = false;
  error: string | null = null;
  entrepriseId: number | null = null;

  constructor(
    private offreService: OffreService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  deleteOffre(id: number): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.deletingOffer = true;
      this.offreService.deleteOffre(id).subscribe(
        (response) => {
          console.log('Response from backend:', response);
          this.offres = this.offres.filter((offer) => offer.id !== id);
          this.deletingOffer = false;
        },
        (error) => {
          console.error('Failed to delete offer:', error);
          this.error = 'Failed to delete offer';
          this.deletingOffer = false;
        }
      );
    }
  }

  openUpdateDialog(offer: Offre) {
    this.router.navigate([`/update-offre-modal/${offer.id}`]);
    }

  

  goToPage(): void {
    this.router.navigate(['/create-offre']);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('entrepriseId');
      this.entrepriseId = id ? +id : null; // Convert to number if exists
      if (this.entrepriseId) {
        this.fetchOffersByEntrepriseId(this.entrepriseId);
      } else {
        this.fetchAllOffers();
      }
    });
  }

  fetchOffersByEntrepriseId(entrepriseId: number): void {
    this.offreService.getOffresByEntrepriseId(entrepriseId).subscribe(
      (data) => {
        this.offres = data;
        this.fetchingOffers = false;
      },
      (error) => {
        console.error('Error fetching offers by entreprise:', error);
        this.fetchingOffers = false;
        this.error = 'Error fetching offers for this entreprise.';
      }
    );
  }

  fetchAllOffers(): void {
    this.offreService.getOffres().subscribe(
      (data) => {
        this.offres = data;
        this.fetchingOffers = false;
      },
      (error) => {
        console.error('Error fetching all offers:', error);
        this.fetchingOffers = false;
        this.error = 'Error fetching offers.';
      }
    );
  }
}

export { Offre };