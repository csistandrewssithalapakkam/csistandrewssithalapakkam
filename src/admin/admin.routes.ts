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
      { 
        path: 'blessing-verses', 
        loadComponent: () => import('./blessing-verse-manager/blessing-verse-manager.component').then(m => m.BlessingVerseManagerComponent)
      },
      { 
        path: 'fellowship/:name', 
        loadComponent: () => import('./fellowship-manager/fellowship-manager.component').then(m => m.FellowshipManagerComponent)
      },
      {
        path: 'quiz',
        loadComponent: () => import('./quiz-manager/quiz-manager.component').then(m => m.QuizManagerComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./user-manager/user-manager.component').then(m => m.UserManagerComponent)
      },
      {
        path: 'pages',
        loadComponent: () => import('./page-manager/page-manager.component').then(m => m.PageManagerComponent)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
