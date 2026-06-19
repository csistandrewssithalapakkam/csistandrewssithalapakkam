import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../environments/environment';

export interface BlessingVerse {
  quote: string | null;
  reference: string | null;
  quoteTamil: string | null;
  referenceTamil: string | null;
}

interface ApiBlessingVerse {
  Verses_english: string | null;
  Loc_english: string | null;
  Verses_tamil: string | null;
  Loc_tamil: string | null;
}

interface MilestoneVerseState {
  verse: BlessingVerse | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MilestoneVerseService {
  // Fix: Explicitly type the injected HttpClient service.
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/blessing-verse/recent?limit=1`;

  private state = signal<MilestoneVerseState>({
    verse: null,
    loading: true,
    error: null,
  });

  // Public signals for components to consume
  verse = computed(() => this.state().verse);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  constructor() {
    this.loadBlessingVerse();
  }

  private loadBlessingVerse() {
    this.state.set({ verse: null, loading: true, error: null });

    this.http.get<ApiBlessingVerse[]>(this.apiUrl).pipe(
      // Fix: Explicitly type the response parameter to resolve 'unknown' type error.
      map((response: ApiBlessingVerse[]) => {
        if (!response || response.length === 0) {
          this.state.update(s => ({ ...s, error: 'No blessing verse found.' }));
          return null;
        }
        const apiVerse = response[0];
        return {
          quote: apiVerse.Verses_english,
          reference: apiVerse.Loc_english,
          quoteTamil: apiVerse.Verses_tamil,
          referenceTamil: apiVerse.Loc_tamil,
        };
      }),
      catchError(error => {
        console.error('Failed to fetch blessing verse', error);
        this.state.update(s => ({ ...s, error: 'Could not load the blessing. Please try again later.' }));
        return of(null);
      })
    ).subscribe(verse => {
      if (verse) {
        this.state.set({ verse: verse, loading: false, error: null });
      } else {
        this.state.update(s => ({ ...s, loading: false }));
      }
    });
  }
}