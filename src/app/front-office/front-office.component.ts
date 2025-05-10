import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormationService } from '../back-office/services/formation.service';
import { Formation } from 'src/app/back-office/models/Formation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.css']
})
export class FrontOfficeComponent implements OnInit, OnDestroy {
  favorites: number[] = [];
  formations: Formation[] = [];
  userId: number = 1; // Replace with actual user ID from authentication service

  private favoritesSubscription: Subscription | undefined;

  constructor(
    private formationService: FormationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to favorites updates
    this.favoritesSubscription = this.formationService.favorites$.subscribe(favorites => {
      console.log('FrontOfficeComponent received favorites:', favorites);
      this.favorites = favorites;
      this.cdr.detectChanges(); // Force change detection to update the UI
    });

    // Load initial favorites after a slight delay to ensure subscription is active
    setTimeout(() => {
      this.formationService.loadFavorites(this.userId);
    }, 0);

    // Load formations
    this.formationService.getAllFormation().subscribe({
      next: (data) => {
        this.formations = data.filter(f => f.is_public);
      },
      error: (error) => {
        console.error('Error loading formations:', error);
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  getFavoriteFormations(): Formation[] {
    return this.formations.filter(f => this.favorites.includes(f.id));
  }

  removeFavorite(formationId: number): void {
    console.log(`Removing favorite formation ${formationId}, current favorites:`, this.favorites);
    this.formationService.removeFromFavorites(this.userId, formationId).subscribe({
      next: () => {
        console.log(`Removed formation ${formationId} from favorites`);
      },
      error: (error) => {
        console.error('Error removing favorite:', error);
      }
    });
  }
}