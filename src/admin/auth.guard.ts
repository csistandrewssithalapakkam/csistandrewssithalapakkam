import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  // Fix: Add explicit type for injected service.
  const authService: AuthService = inject(AuthService);
  // Fix: Add explicit type for injected service.
  const router: Router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/admin/login');
};
