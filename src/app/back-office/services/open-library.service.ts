import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces pour typer les réponses de l’API
interface Book {
  title: string;
  author_name?: string[];
  cover_i?: number;
}

interface OpenLibraryResponse {
  docs: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryService {
  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  getBooks(query: string): Observable<OpenLibraryResponse> {
    return this.http.get<OpenLibraryResponse>(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
  }

  getCoverUrl(coverId: number | undefined): string {
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-S.jpg` : 'assets/img/courses/default.jpg';
  }
}