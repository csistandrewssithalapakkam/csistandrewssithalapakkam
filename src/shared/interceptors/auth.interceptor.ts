import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../services/../../environments/environment';

let isRefreshingAdmin = false;
let adminRefreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

let isRefreshingQuizTaker = false;
let quizTakerRefreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

let isRefreshingWebUser = false;
let webUserRefreshSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const http = inject(HttpClient);
    const url = req.url;

    // Skip interceptor for external URLs (e.g. YouTube oEmbed, CDNs)
    if (!url.includes('/api/')) {
        return next(req);
    }

    // 1. Endpoints that require NO TOKEN (Public)
    if (url.includes('/api/quizzes/register') || url.includes('/api/auth/login') ||
        (url.includes('/api/posts') && req.method === 'GET')) {
        return next(req);
    }

    // 2. Refresh Token Endpoints
    if (url.includes('/api/auth/refresh')) {
        const refresh = tokenService.getAdminRefreshToken();
        if (refresh) {
            req = req.clone({ setHeaders: { Authorization: "Bearer " + refresh } });
        }
        return next(req);
    }

    if (url.includes('/api/quiz-taker/refresh')) {
        const refresh = tokenService.getQuizTakerRefreshToken();
        if (refresh) {
            req = req.clone({ setHeaders: { Authorization: "Bearer " + refresh } });
        }
        return next(req);
    }

    // Determine request type for correct token attachments and refresh logic
    const isQuizzesUrl = url.includes('/api/quizzes');
    const isMissionaryUrl = url.includes('/api/missionary-stories');
    const isRibbonUrl = url.includes('/api/ribbon');
    const isBlessingVerseUrl = url.includes('/api/blessing-verse');
    const isDailyVerseUrl = url.includes('/api/daily-verse');
    const isPrayerRequestUrl = url.includes('/api/prayer-request');
    const isPostsUrl = url.includes('/api/posts');

    // Admin Action: Explicitly identified as an admin-guarded endpoint.
    // Refresh logic MUST trigger if these fail with 401.
    const isAdminAction = (isQuizzesUrl && ['POST', 'PUT', 'DELETE'].includes(req.method) && !url.includes('/register')) ||
        (isQuizzesUrl && url.includes('/freeze')) ||
        (isMissionaryUrl && !url.includes('/active')) ||
        isRibbonUrl ||
        (isBlessingVerseUrl && !url.includes('/recent')) ||
        (isDailyVerseUrl && req.method !== 'GET') ||
        (isPrayerRequestUrl && req.method !== 'POST') ||
        (isPostsUrl && ['POST', 'PUT', 'DELETE'].includes(req.method)) ||
        url.includes('/api/auth/refresh'); // Self-identified as admin for handle401 context

    const isSubmissionUrl = url.includes('/api/quiz-submissions');
    const isSubmissionAction = isSubmissionUrl && req.method === 'POST';

    let targetTokenType: 'admin' | 'quiz_taker' | 'web_user' | 'none' = 'none';

    // 3. Attach Tokens based on Action Type or Availability
    if (isAdminAction) {
        targetTokenType = 'admin';
        const adminToken = tokenService.getAdminAccessToken();
        if (adminToken) {
            req = req.clone({ setHeaders: { Authorization: "Bearer " + adminToken } });
        }
    } else if (isSubmissionAction) {
        targetTokenType = 'quiz_taker';
        const quizTakerToken = tokenService.getQuizTakerAccessToken();
        if (quizTakerToken) {
            req = req.clone({ setHeaders: { Authorization: "Bearer " + quizTakerToken } });
        }
    } else {
        // Fallback: admin token → quiz taker token → web user token (public read access)
        const adminToken = tokenService.getAdminAccessToken();
        if (adminToken) {
            targetTokenType = 'admin';
            req = req.clone({ setHeaders: { Authorization: "Bearer " + adminToken } });
        } else {
            const quizTakerToken = tokenService.getQuizTakerAccessToken();
            if (quizTakerToken) {
                targetTokenType = 'quiz_taker';
                req = req.clone({ setHeaders: { Authorization: "Bearer " + quizTakerToken } });
            } else {
                const webUserToken = tokenService.getWebUserAccessToken();
                if (webUserToken) {
                    targetTokenType = 'web_user';
                    req = req.clone({ setHeaders: { Authorization: "Bearer " + webUserToken } });
                }
            }
        }
    }

    // 4. Inject Audit Fields (createdBy, updatedBy) for Admin Modifying Requests
    if (targetTokenType === 'admin' && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const userName = tokenService.getAdminUserName() || 'Admin';
        let body = req.body;
        
        // Ensure it's a JSON object payload (not FormData or primitive)
        if (body && typeof body === 'object' && !Array.isArray(body) && !(body instanceof FormData)) {
            body = {
                ...body,
                updatedBy: userName,
                // Only add createdBy if it's a POST request (creation)
                ...(req.method === 'POST' ? { createdBy: userName } : {})
            };
            req = req.clone({ body });
        }
    }

    return next(req).pipe(
        catchError((error) => {
            // Handle 401 Unauthorized
            // Handle 401 Unauthorized
            if (error instanceof HttpErrorResponse && error.status === 401) {
                const baseUrl = environment.apiBaseUrl;

                if (targetTokenType === 'admin') {
                    return handle401Admin(req, next, tokenService, http, router, baseUrl);
                } else if (targetTokenType === 'quiz_taker') {
                    return handle401QuizTaker(req, next, tokenService, http, router, baseUrl);
                } else if (targetTokenType === 'web_user') {
                    return handle401WebUser(req, next, tokenService, http, baseUrl);
                }
            }
            return throwError(() => error);
        })
    );
};

function handle401Admin(req: HttpRequest<any>, next: HttpHandlerFn, tokenService: TokenService, http: HttpClient, router: Router, baseUrl: string) {
    if (!isRefreshingAdmin) {
        isRefreshingAdmin = true;
        adminRefreshTokenSubject.next(null);

        const refreshToken = tokenService.getAdminRefreshToken();
        if (!refreshToken) {
            tokenService.clearAdminTokens();
            router.navigate(['/admin/login']);
            return throwError(() => new Error('No admin refresh token available'));
        }

        return http.post<any>(baseUrl + '/auth/refresh', {}, {
            headers: { Authorization: "Bearer " + refreshToken }
        }).pipe(
            switchMap((tokenResponse: any) => {
                isRefreshingAdmin = false;
                const newAccessToken = tokenResponse.access_token || tokenResponse.token;
                const newRefreshToken = tokenResponse.refresh_token || '';
                if (newAccessToken) {
                    tokenService.setAdminTokens(newAccessToken, newRefreshToken);
                    adminRefreshTokenSubject.next(newAccessToken);
                    return next(req.clone({ setHeaders: { Authorization: "Bearer " + newAccessToken } }));
                }
                tokenService.clearAdminTokens();
                router.navigate(['/admin/login']);
                return throwError(() => new Error('Admin token refresh failed'));
            }),
            catchError((err) => {
                isRefreshingAdmin = false;
                tokenService.clearAdminTokens();
                router.navigate(['/admin/login']);
                return throwError(() => err);
            })
        );
    } else {
        return adminRefreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((jwt) => next(req.clone({ setHeaders: { Authorization: "Bearer " + jwt } })))
        );
    }
}

function handle401QuizTaker(req: HttpRequest<any>, next: HttpHandlerFn, tokenService: TokenService, http: HttpClient, router: Router, baseUrl: string) {
    if (!isRefreshingQuizTaker) {
        isRefreshingQuizTaker = true;
        quizTakerRefreshTokenSubject.next(null);

        const refreshToken = tokenService.getQuizTakerRefreshToken();
        if (!refreshToken) {
            return attemptQuizTakerRecovery(req, next, tokenService, http, router, baseUrl);
        }

        return http.post<any>(baseUrl + '/quiz-taker/refresh', {}, {
            headers: { Authorization: "Bearer " + refreshToken }
        }).pipe(
            switchMap((tokenResponse: any) => {
                isRefreshingQuizTaker = false;
                const newAccessToken = tokenResponse.access_token || tokenResponse.token;
                const newRefreshToken = tokenResponse.refresh_token || '';
                if (newAccessToken) {
                    tokenService.setQuizTakerTokens(newAccessToken, newRefreshToken);
                    quizTakerRefreshTokenSubject.next(newAccessToken);
                    return next(req.clone({ setHeaders: { Authorization: "Bearer " + newAccessToken } }));
                }
                return attemptQuizTakerRecovery(req, next, tokenService, http, router, baseUrl);
            }),
            catchError((err) => {
                isRefreshingQuizTaker = false;
                return attemptQuizTakerRecovery(req, next, tokenService, http, router, baseUrl);
            })
        );
    } else {
        return quizTakerRefreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((jwt) => next(req.clone({ setHeaders: { Authorization: "Bearer " + jwt } })))
        );
    }
}

function handle401WebUser(req: HttpRequest<any>, next: HttpHandlerFn, tokenService: TokenService, http: HttpClient, baseUrl: string): Observable<HttpEvent<any>> {
    if (!isRefreshingWebUser) {
        isRefreshingWebUser = true;
        webUserRefreshSubject.next(null);
        tokenService.clearWebUserTokens();

        return http.post<any>(baseUrl + '/auth/login', { user_name: 'Webuser', user_password: 'Welcome@123' }).pipe(
            switchMap((res: any) => {
                isRefreshingWebUser = false;
                const token = res?.access_token;
                if (token) {
                    tokenService.setWebUserTokens(token, res.refresh_token || '');
                    webUserRefreshSubject.next(token);
                    return next(req.clone({ setHeaders: { Authorization: "Bearer " + token } }));
                }
                return throwError(() => new Error('Web user login failed'));
            }),
            catchError((err) => {
                isRefreshingWebUser = false;
                return throwError(() => err);
            })
        );
    } else {
        return webUserRefreshSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((jwt) => next(req.clone({ setHeaders: { Authorization: "Bearer " + jwt } })))
        );
    }
}

function attemptQuizTakerRecovery(req: HttpRequest<any>, next: HttpHandlerFn, tokenService: TokenService, http: HttpClient, router: Router, baseUrl: string): Observable<HttpEvent<any>> {
    const cachedInfo = localStorage.getItem('quiz_user_info');
    if (!cachedInfo) {
        tokenService.clearQuizTakerTokens();
        router.navigate(['/']);
        isRefreshingQuizTaker = false;
        return throwError(() => new Error('No cached user info for recovery'));
    }

    try {
        const userInfo = JSON.parse(cachedInfo);
        return http.post<any>(baseUrl + '/quizzes/register', userInfo).pipe(
            switchMap((res: any) => {
                isRefreshingQuizTaker = false;
                if (res.success && res.data) {
                    const token = res.data.access_token || res.access_token || res.data.token || res.token || '';
                    const refresh = res.data.refresh_token || res.refresh_token || '';
                    if (token) {
                        tokenService.setQuizTakerTokens(token, refresh);
                        quizTakerRefreshTokenSubject.next(token);
                        return next(req.clone({ setHeaders: { Authorization: "Bearer " + token } }));
                    }
                }
                tokenService.clearQuizTakerTokens();
                router.navigate(['/']);
                return throwError(() => new Error('Recovery registration failed'));
            }),
            catchError((err) => {
                isRefreshingQuizTaker = false;
                tokenService.clearQuizTakerTokens();
                router.navigate(['/']);
                return throwError(() => err);
            })
        );
    } catch (e) {
        isRefreshingQuizTaker = false;
        tokenService.clearQuizTakerTokens();
        router.navigate(['/']);
        return throwError(() => new Error('Failed to parse cached user info'));
    }
}
