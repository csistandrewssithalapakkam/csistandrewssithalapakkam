import { Injectable, inject, signal } from '@angular/core';
import { UserService } from './user-manager/user.service';
import { PageAccess } from '../shared/models/admin-user.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private userService = inject(UserService);
  private access = signal<PageAccess[]>([]);
  loaded = signal(false);

  load() {
    if (this.loaded()) return;
    this.userService.getMyPageAccess().subscribe(res => {
      this.access.set(res.success ? res.data : []);
      this.loaded.set(true);
    });
  }

  private noRestrictions(): boolean {
    return this.access().length === 0;
  }

  hasAccess(slug: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().some(p => p.page_slug === slug);
  }

  hasAccessByName(name: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().some(p => p.page_name === name);
  }

  canCreate(slug: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().find(p => p.page_slug === slug)?.can_create ?? false;
  }

  canEdit(slug: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().find(p => p.page_slug === slug)?.can_edit ?? false;
  }

  canDelete(slug: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().find(p => p.page_slug === slug)?.can_delete ?? false;
  }

  canCreateByName(name: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().find(p => p.page_name === name)?.can_create ?? false;
  }

  canEditByName(name: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().find(p => p.page_name === name)?.can_edit ?? false;
  }

  canDeleteByName(name: string): boolean {
    if (!this.loaded()) return true;
    if (this.noRestrictions()) return true;
    return this.access().find(p => p.page_name === name)?.can_delete ?? false;
  }

  getFirstAccessibleRoute(): string[] {
    const pages = this.access();
    if (pages.length === 0) return ['gallery'];
    const SLUG_TO_ROUTE: Record<string, string[]> = {
      'gallery': ['gallery'],
      'banners': ['banners'],
      'missions': ['missions'],
      'prayers': ['prayers'],
      'events': ['events'],
      'blessing-verses': ['blessing-verses'],
      'quiz': ['quiz'],
      'users': ['users'],
      'pages': ['pages'],
    };
    for (const page of pages) {
      if (page.can_view) {
        const route = SLUG_TO_ROUTE[page.page_slug];
        if (route) return route;
        // Any slug not in the known map and not the fellowship parent = fellowship sub-page
        if (page.page_slug !== 'fellowship') {
          return ['fellowship', page.page_name];
        }
      }
    }
    return ['gallery'];
  }
}
