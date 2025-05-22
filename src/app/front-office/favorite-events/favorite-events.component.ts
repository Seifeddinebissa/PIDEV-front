import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { Event } from '../../back-office/models/event';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-favorite-events',
  templateUrl: './favorite-events.component.html',
  styleUrls: ['./favorite-events.component.css']
})
export class FavoriteEventsComponent implements OnInit, OnDestroy {
  favoriteEvents: Event[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFavoriteEvents(): void {
    this.favoriteService.getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe(events => {
        this.favoriteEvents = events;
      });
  }

  removeFromFavorites(idEvent: number): void {
    this.favoriteService.removeFromFavorites(idEvent);
    this.toastr.success('Event removed from favorites', 'Success');
  }

  viewEventDetails(idEvent: number): void {
    this.router.navigate(['/events', idEvent]);
  }
} 