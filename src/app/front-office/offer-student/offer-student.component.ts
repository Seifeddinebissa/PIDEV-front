import { Component, OnInit } from '@angular/core';
import { OffreService } from '../services/offre.service';  
import { Offre } from '../Models/offre.model'; 
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offre-student',
  templateUrl: './offer-student.component.html',
  styleUrls: ['./offer-student.component.css']
})
export class OfferStudentComponent implements OnInit {
  offres: Offre[] = [];
  loading: boolean = true;
  error: string | null = null;
  staticStudentId: number = 123; 

  constructor(
    private offreService: OffreService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offreService.getOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
        this.error = 'Failed to load offers.';
        this.loading = false;
      }
    });
  }

  apllyOffre(offer: Offre): void {
    const applicationData = { studentId: this.staticStudentId, offerId: offer.id };

    this.offreService.applyToOffer(applicationData).subscribe({
      next: () => alert('Application submitted successfully!'),
      error: (err) => {
        console.error('Error applying:', err);
        this.error = 'Failed to apply.';
      }
    });
  }

  isFavorited(offer: Offre): boolean {
    return offer.favorites?.some(fav => fav.studentId === this.staticStudentId);
  }

  toggleFavoris(offer: Offre): void {
    const favoriteData = { studentId: this.staticStudentId, offerId: offer.id };
    const isFav = this.isFavorited(offer);
    const action = isFav ? this.offreService.removeFavoris(favoriteData) : this.offreService.addFavoris(favoriteData);

    action.subscribe({
      next: () => {
        if (isFav) {
          offer.favorites = offer.favorites.filter(fav => fav.studentId !== this.staticStudentId);
        } else {
          offer.favorites.push({ id: Date.now(), studentId: this.staticStudentId, offre: offer });
        }
      },
      // error: (err) => {
      //   console.error('Error toggling favorite:', err);
      //   this.error = 'Failed to toggle favorite.';
      // }
    });
  }
  upload(offer: Offre): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx'; // Restrict to common CV formats
  
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('studentId', this.staticStudentId.toString());
        formData.append('offerId', offer.id.toString());
  
        this.offreService.uploadCV(formData).subscribe({
          next: () => alert('CV uploaded successfully!'),
          error: (err) => {
            console.error('Error uploading CV:', err);
            this.error = 'Failed to upload CV. Please try again.';
          }
        });
      }
    };
  
    fileInput.click(); // Trigger file selection dialog
  }
}
