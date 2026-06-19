import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { TokenService } from '../shared/services/token.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  private router = inject(Router);
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor() {
    // Check initial auth state
    if (this.tokenService.getAdminAccessToken()) {
      this.isAuthenticated.set(true);
    }
  }

  login(user_name: string, user_password: string): Observable<{ success: boolean; message?: string }> {
    return this.http.post<any>(`${this.apiUrl}/login`, { user_name, user_password }).pipe(
      tap(res => {
        if (res.access_token) {
          this.tokenService.setAdminTokens(res.access_token, res.refresh_token || '');
          this.tokenService.setAdminUserName(user_name);
          this.isAuthenticated.set(true);
          this.router.navigate(['/admin/dashboard']);
        }
      }),
      catchError(err => {
        this.isAuthenticated.set(false);
        this.tokenService.clearAdminTokens();
        return of({ success: false, message: err?.error?.message || 'Invalid credentials' });
      })
    );
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.tokenService.clearAdminTokens();
    this.router.navigate(['/admin/login']);
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {}).pipe(
      tap(res => {
        if (res.access_token) {
          this.tokenService.setAdminTokens(res.access_token, res.refresh_token || '');
        }
      }),
      catchError(err => {
        this.logout();
        return of(null);
      })
    );
  }
}