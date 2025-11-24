import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  private router: Router = inject(Router);

  login(username: string, password: string):boolean {
    if (username === 'admin' && password === 'admin@123') {
      this.isAuthenticated.set(true);
      this.router.navigate(['/admin/dashboard']);
      return true;
    }
    this.isAuthenticated.set(false);
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }
}