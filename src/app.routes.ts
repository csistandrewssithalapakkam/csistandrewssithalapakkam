import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./main/main.component').then(m => m.MainComponent),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'gallery',
    loadComponent: () => import('./gallery-page/gallery-page.component').then(m => m.GalleryPageComponent),
  },
  {
    path: 'forms',
    loadComponent: () => import('./forms-page/forms-page.component').then(m => m.FormsPageComponent),
  },
  {
    path: 'history',
    loadComponent: () => import('./church-history/church-history.component').then(m => m.ChurchHistoryComponent),
  },
  {
    path: 'fellowship/:name',
    loadComponent: () => import('./fellowship-posts/fellowship-posts.component').then(m => m.FellowshipPostsComponent),
  },
  {
    path: 'quiz',
    children: [
      {
        path: '',
        loadComponent: () => import('./quiz/quiz-list.component').then(m => m.QuizListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./quiz/quiz-taker.component').then(m => m.QuizTakerComponent)
      }
    ]
  },
  {
    path: 'vbs2026',
    loadComponent: () => import('./vbs2026/vbs2026.component').then(m => m.Vbs2026Component),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
