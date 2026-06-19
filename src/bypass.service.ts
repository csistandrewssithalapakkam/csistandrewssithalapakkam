import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BypassService {
  // Fix: Explicitly type the injected HttpClient service.
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/ribbon`;

  isUnlocked = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  constructor() {
    this.checkRibbonStatus();
  }

  private async checkRibbonStatus(): Promise<void> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<{ ribbon: boolean }>(this.apiUrl).pipe(
          catchError(error => {
            console.error('Failed to fetch ribbon status:', error);
            // Default to showing "Coming Soon" page on error
            return of({ ribbon: false });
          })
        )
      );
      // Fix: Cast the response to the expected type to resolve the 'unknown' type error.
      this.isUnlocked.set((response as { ribbon: boolean }).ribbon);
    } catch (error) {
      // This catch is for unexpected errors not handled by catchError
      console.error('An unexpected error occurred while fetching ribbon status:', error);
      this.isUnlocked.set(false);
    } finally {
      this.isLoading.set(false);
    }
  }

  updateRibbonStatus(): Promise<any> {
    const body = { ribbon_status: 1 };
    return firstValueFrom(this.http.post(this.apiUrl, body).pipe(
      catchError(error => {
        console.error('Failed to update ribbon status:', error);
        // Allow the calling component to handle UI aspects of failure
        return Promise.reject(error);
      })
    ));
  }
}