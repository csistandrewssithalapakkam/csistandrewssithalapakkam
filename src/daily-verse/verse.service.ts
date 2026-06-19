import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../environments/environment';

export interface Verse {
  quote: string | null;
  reference: string | null;
  quoteTamil: string | null;
  referenceTamil: string | null;
}

interface ApiVerseResponse {
  Verses_English: string | null;
  Loc_English: string | null;
  Verses_Tamil: string | null;
  Loc_tamil: string | null;
}

interface VerseState {
  verse: Verse | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class VerseService {
  // Fix: Explicitly type the injected HttpClient service.
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/daily-verse`;

  private state = signal<VerseState>({
    verse: null,
    loading: true,
    error: null,
  });

  // Public signals for components to consume
  verse = computed(() => this.state().verse);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  constructor() {
    this.loadDailyVerse();
  }

  private loadDailyVerse() {
    this.state.set({ verse: null, loading: true, error: null });

    this.http.get<ApiVerseResponse>(this.apiUrl).pipe(
      // Fix: Explicitly type the response parameter to resolve 'unknown' type error.
      map((response: ApiVerseResponse) => ({
        quote: response.Verses_English,
        reference: response.Loc_English,
        quoteTamil: response.Verses_Tamil,
        referenceTamil: response.Loc_tamil,
      })),
      catchError(error => {
        console.error('Failed to fetch daily verse', error);
        this.state.update(s => ({ ...s, error: 'Could not load the verse. Please try again later.' }));
        return of(null);
      })
    ).subscribe(verse => {
      if (verse) {
        this.state.set({ verse: verse, loading: false, error: null });
      } else {
        // If there was an error, the error state is already set.
        // Just update loading state.
        this.state.update(s => ({ ...s, loading: false }));
      }
    });
  }
}