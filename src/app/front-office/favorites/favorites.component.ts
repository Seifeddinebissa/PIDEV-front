// src/app/front-office/favorites/favorites.component.ts
import { Component, OnInit } from '@angular/core';
import { OffreService, Offre, FavoriteStats } from '../services/offre.service';
import { Favorite } from '../Models/offre.model';
import { HttpErrorResponse } from '@angular/common/http';

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
  topFavorited: FavoriteStats[] = [];

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.loadTopFavorited();
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
    if (!this.staticStudentId || !offer || !offer.id) {
      console.warn('Invalid student ID or offer provided');
      return;
    }
  
    const favoriteData = {
      studentId: this.staticStudentId, // Guaranteed to be a number here
      offerId: offer.id
    };
  
    this.offreService.removeFavoris(favoriteData).subscribe({
      next: () => {
        console.log('Favorite removed successfully');
        offer.favorites = offer.favorites?.filter((fav: Favorite) => fav.studentId !== this.staticStudentId) || [];
        this.favoriteOffres = this.favoriteOffres?.filter(fav => fav.id !== offer.id) || [];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error removing favorite:', error);
        this.error = 'Failed to remove favorite.';
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

  loadTopFavorited(): void {
    this.offreService.getFavoriteAnalytics(5).subscribe({
      next: (data) => this.topFavorited = data,
      error: (err) => console.error('Error fetching top favorited:', err)
    });
  }
  
}