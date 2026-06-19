import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly ADMIN_ACCESS_KEY = 'admin_access_token';
    private readonly ADMIN_REFRESH_KEY = 'admin_refresh_token';
    private readonly ADMIN_USER_NAME_KEY = 'admin_user_name';
    private readonly QUIZ_TAKER_ACCESS_KEY = 'quiz_taker_access_token';
    private readonly QUIZ_TAKER_REFRESH_KEY = 'quiz_taker_refresh_token';

    // --- Admin Tokens ---
    getAdminAccessToken(): string | null {
        return localStorage.getItem(this.ADMIN_ACCESS_KEY);
    }

    setAdminTokens(access: string, refresh: string): void {
        localStorage.setItem(this.ADMIN_ACCESS_KEY, access);
        localStorage.setItem(this.ADMIN_REFRESH_KEY, refresh);
    }

    getAdminRefreshToken(): string | null {
        return localStorage.getItem(this.ADMIN_REFRESH_KEY);
    }

    getAdminUserName(): string | null {
        return localStorage.getItem(this.ADMIN_USER_NAME_KEY);
    }

    setAdminUserName(userName: string): void {
        localStorage.setItem(this.ADMIN_USER_NAME_KEY, userName);
    }

    clearAdminTokens(): void {
        localStorage.removeItem(this.ADMIN_ACCESS_KEY);
        localStorage.removeItem(this.ADMIN_REFRESH_KEY);
        localStorage.removeItem(this.ADMIN_USER_NAME_KEY);
    }

    // --- Quiz Taker Tokens ---
    getQuizTakerAccessToken(): string | null {
        return localStorage.getItem(this.QUIZ_TAKER_ACCESS_KEY);
    }

    setQuizTakerTokens(access: string, refresh: string): void {
        localStorage.setItem(this.QUIZ_TAKER_ACCESS_KEY, access);
        localStorage.setItem(this.QUIZ_TAKER_REFRESH_KEY, refresh);
    }

    getQuizTakerRefreshToken(): string | null {
        return localStorage.getItem(this.QUIZ_TAKER_REFRESH_KEY);
    }

    clearQuizTakerTokens(): void {
        localStorage.removeItem(this.QUIZ_TAKER_ACCESS_KEY);
        localStorage.removeItem(this.QUIZ_TAKER_REFRESH_KEY);
    }

    // --- Web User Tokens (read-only public access) ---
    private readonly WEB_USER_ACCESS_KEY  = 'web_user_access_token';
    private readonly WEB_USER_REFRESH_KEY = 'web_user_refresh_token';

    getWebUserAccessToken(): string | null {
        return localStorage.getItem(this.WEB_USER_ACCESS_KEY);
    }

    setWebUserTokens(access: string, refresh: string): void {
        localStorage.setItem(this.WEB_USER_ACCESS_KEY, access);
        localStorage.setItem(this.WEB_USER_REFRESH_KEY, refresh);
    }

    getWebUserRefreshToken(): string | null {
        return localStorage.getItem(this.WEB_USER_REFRESH_KEY);
    }

    clearWebUserTokens(): void {
        localStorage.removeItem(this.WEB_USER_ACCESS_KEY);
        localStorage.removeItem(this.WEB_USER_REFRESH_KEY);
    }
}
