import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../../back-office/models/event';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesKey = 'favorite_events';
  private favoritesSubject = new BehaviorSubject<Event[]>(this.getFavoritesFromStorage());

  constructor() {}

  private getFavoritesFromStorage(): Event[] {
    const favoritesJson = localStorage.getItem(this.favoritesKey);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }

  private saveFavoritesToStorage(favorites: Event[]): void {
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  getFavorites(): Observable<Event[]> {
    return this.favoritesSubject.asObservable();
  }

  addToFavorites(event: Event): void {
    const favorites = this.getFavoritesFromStorage();
    if (!favorites.some(fav => fav.idEvent === event.idEvent)) {
      favorites.push(event);
      this.saveFavoritesToStorage(favorites);
    }
  }

  removeFromFavorites(eventId: number): void {
    const favorites = this.getFavoritesFromStorage();
    const updatedFavorites = favorites.filter(fav => fav.idEvent !== eventId);
    this.saveFavoritesToStorage(updatedFavorites);
  }

  isFavorite(eventId: number): boolean {
    const favorites = this.getFavoritesFromStorage();
    return favorites.some(fav => fav.idEvent === eventId);
  }
} 