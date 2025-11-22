
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(ReactiveFormsModule),
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types'.

// AI Studio always uses an `index.tsx` file for all project types.