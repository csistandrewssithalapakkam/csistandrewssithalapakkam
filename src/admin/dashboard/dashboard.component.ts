import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  authService: AuthService = inject(AuthService);
  isSidebarExpanded = signal(true);

  toggleSidebar() {
    this.isSidebarExpanded.update((v) => !v);
  }

  logout() {
    this.authService.logout();
  }
}
