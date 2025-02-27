// src/app/front-office/favorites/favorites.component.ts
import { Component, OnInit } from '@angular/core';
import { OffreService, Offre } from '../services/offre.service';
import { Favorite } from '../Models/offre.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteOffres: Offre[] = [];
  loading: boolean = true;
  error: string | null = null;
  staticStudentId: number = 123;

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.offreService.getOffres().subscribe({
      next: (data: Offre[]) => {
        console.log('Data fetched:', data);
  
        // Log favorites for each offer
        data.forEach(offer => {
          console.log(`Offer ID: ${offer.id}, Favorites:`, offer.favorites);
        });
  
        // Ensure 'favorites' exists before accessing 'some'
        this.favoriteOffres = data.filter(offer =>
          offer.favorites && Array.isArray(offer.favorites) && offer.favorites.some((fav: Favorite) => fav.studentId === this.staticStudentId)
        );
  
        console.log('Filtered favorite offers:', this.favoriteOffres);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching favorites:', err);
        this.loading = false;
        this.error = 'Failed to load favorite offers.';
      }
    });
  }
  
  
  
  

  removeFavoris(offer: Offre): void {
    const favoriteData = {
      studentId: this.staticStudentId,
      offerId: offer.id
    };
    this.offreService.removeFavoris(favoriteData).subscribe({
      next: () => {
        offer.favorites = offer.favorites.filter((fav: Favorite) => fav.studentId !== this.staticStudentId);
        this.favoriteOffres = this.favoriteOffres.filter(fav => fav.id !== offer.id);
        console.log('Removed from favorites');
      },
      error: (error: any) => {
        console.error('Error removing favorite:', error);
        this.error = 'Failed to remove favorite.';
      }
    });
  }

  // applyOffer(offer: Offre): void {
  //   const applicationData = {
  //     studentId: this.staticStudentId,
  //     offerId: offer.id
  //   };
  //   this.offreService.uploadCV(formData).subscribe({
  //     next: () => alert('Application submitted successfully!'),
  //     error: (error: any) => this.error = 'Failed to submit application.'
  //   });
  // }

  // uploadCV(offer: Offre): void {
  //   const fileInput = document.createElement('input');
  //   fileInput.type = 'file';
  //   fileInput.accept = '.pdf,.doc,.docx';
  //   fileInput.onchange = (event: Event) => {
  //     const target = event.target as HTMLInputElement;
  //     const file = target.files?.[0];
  //     if (file) {
  //       const formData = new FormData();
  //       formData.append('file', file);
  //       formData.append('studentId', this.staticStudentId.toString());
  //       formData.append('offerId', offer.id.toString());
  //       this.offreService.applyToOffer(formData).subscribe({
  //         next: () => alert('File uploaded successfully!'),
  //         error: (error: any) => this.error = 'Failed to upload file.'
  //       });
  //     }
  //   };
  //   fileInput.click();
  // }
}