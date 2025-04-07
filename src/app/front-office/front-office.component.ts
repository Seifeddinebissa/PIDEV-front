import { Component, OnInit } from '@angular/core';
import { FormationService } from '../back-office/services/formation.service';
import { Formation } from 'src/app/back-office/models/Formation';

@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.css']
})
export class FrontOfficeComponent implements OnInit {
  favorites: number[] = [];
  formations: Formation[] = [];

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.formationService.getAllFormation().subscribe(
      (data) => {
        this.formations = data.filter(f => f.is_public);
      },
      (error) => {
        console.error('Error loading formations', error);
      }
    );
  }

  loadFavorites(): void {
    const savedFavorites = localStorage.getItem('favorites');
    this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  }

  getFavoriteFormations(): Formation[] {
    return this.formations.filter(f => this.favorites.includes(f.id));
  }

  // Nouvelle méthode pour supprimer un favori
  removeFavorite(formationId: number): void {
    const index = this.favorites.indexOf(formationId);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  }
}