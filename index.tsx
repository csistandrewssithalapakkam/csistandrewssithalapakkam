
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';
import { authInterceptor } from './src/shared/interceptors/auth.interceptor';
import { WebUserAuthService } from './src/shared/services/web-user-auth.service';
import { firstValueFrom } from 'rxjs';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => firstValueFrom(inject(WebUserAuthService).login())),
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.