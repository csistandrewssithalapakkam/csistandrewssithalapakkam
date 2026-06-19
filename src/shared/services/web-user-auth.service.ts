import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebUserAuthService {
    private http = inject(HttpClient);
    private tokenService = inject(TokenService);
    private readonly loginUrl = `${environment.apiBaseUrl}/auth/login`;

    login(): Observable<void> {
        if (this.tokenService.getWebUserAccessToken()) {
            return of(undefined);
        }
        return this.http.post<any>(this.loginUrl, {
            user_name: 'Webuser',
            user_password: 'Welcome@123'
        }).pipe(
            tap(res => {
                if (res?.access_token) {
                    this.tokenService.setWebUserTokens(res.access_token, res.refresh_token || '');
                }
            }),
            map(() => undefined),
            catchError(() => of(undefined))
        );
    }
}
