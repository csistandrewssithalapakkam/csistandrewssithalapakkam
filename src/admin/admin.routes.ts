import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'gallery', pathMatch: 'full' },
      { 
        path: 'gallery', 
        loadComponent: () => import('./gallery-manager/gallery-manager.component').then(m => m.GalleryManagerComponent)
      },
      { 
        path: 'banners', 
        loadComponent: () => import('./banner-manager/banner-manager.component').then(m => m.BannerManagerComponent)
      },
      { 
        path: 'missions', 
        loadComponent: () => import('./mission-manager/mission-manager.component').then(m => m.MissionManagerComponent)
      },
      { 
        path: 'prayers', 
        loadComponent: () => import('./prayer-manager/prayer-manager.component').then(m => m.PrayerManagerComponent)
      },
      { 
        path: 'events', 
        loadComponent: () => import('./event-manager/event-manager.component').then(m => m.EventManagerComponent)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];