import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiBlessingVerse {
  id: number;
  Verses_english: string;
  Loc_english: string;
  Verses_tamil: string;
  Loc_tamil: string;
  created_date: string;
  updated_date: string;
}

export interface BlessingVerse {
  id: number;
  verseEnglish: string;
  locationEnglish: string;
  verseTamil: string;
  locationTamil: string;
  createdDate: Date;
}

export interface NewBlessingVerse {
  Verses_english: string;
  Loc_english: string;
  Verses_tamil: string;
  Loc_tamil: string;
}

interface BlessingVerseState {
  verses: BlessingVerse[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BlessingVerseService {
  // Fix: Explicitly type the injected HttpClient service.
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/blessing-verse`;

  private state = signal<BlessingVerseState>({
    verses: [],
    loading: false,
    error: null,
  });

  verses = computed(() => this.state().verses);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  constructor() {
    this.loadRecentVerses();
  }

  loadRecentVerses() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    const recentUrl = `${this.apiUrl}/recent`;

    this.http.get<ApiBlessingVerse[]>(recentUrl).pipe(
      // Fix: Explicitly type the parameter to resolve 'unknown' type error.
      map((apiVerses: ApiBlessingVerse[]) => apiVerses.map(this.mapToBlessingVerse)),
      catchError(error => {
        console.error('Failed to fetch blessing verses', error);
        this.state.update(s => ({ ...s, error: 'Could not load blessing verses.' }));
        return of([]);
      })
    ).subscribe(verses => {
      this.state.set({ verses, loading: false, error: this.state().error });
    });
  }

  addVerse(verseData: NewBlessingVerse): Promise<any> {
    return firstValueFrom(this.http.post(this.apiUrl, verseData));
  }

  private mapToBlessingVerse(apiVerse: ApiBlessingVerse): BlessingVerse {
    return {
      id: apiVerse.id,
      verseEnglish: apiVerse.Verses_english,
      locationEnglish: apiVerse.Loc_english,
      verseTamil: apiVerse.Verses_tamil,
      locationTamil: apiVerse.Loc_tamil,
      createdDate: new Date(apiVerse.created_date),
    };
  }
}