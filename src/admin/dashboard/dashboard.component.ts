import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';
import { FellowshipService } from '../../fellowship-groups/fellowship.service';
import { PermissionService } from '../permission.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  authService = inject(AuthService);
  fellowshipService = inject(FellowshipService);
  protected permissionService = inject(PermissionService);
  private router = inject(Router);

  isSidebarExpanded = signal(true);
  isFellowshipMenuOpen = signal(false);

  hasFellowshipMenuAccess(): boolean {
    return this.permissionService.hasAccess('fellowship') ||
      this.fellowshipService.fellowshipGroups().some(f => this.permissionService.hasAccessByName(f.name));
  }

  constructor() {
    this.permissionService.load();

    // Once permissions load, redirect to first accessible page if on root dashboard
    effect(() => {
      if (this.permissionService.loaded()) {
        const route = this.permissionService.getFirstAccessibleRoute();
        // Auto-expand fellowship submenu if user's first route is a fellowship page
        if (route[0] === 'fellowship') {
          this.isFellowshipMenuOpen.set(true);
        }
        const url = this.router.url;
        if (url === '/admin/dashboard' || url === '/admin/dashboard/') {
          this.router.navigate(['/admin/dashboard', ...route]);
        }
      }
    });
  }

  toggleSidebar() {
    this.isSidebarExpanded.update(v => !v);
  }

  toggleFellowshipMenu() {
    this.isFellowshipMenuOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
