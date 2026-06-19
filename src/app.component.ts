import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LaunchPopupService } from './shared/launch-popup/launch-popup.service';

// Declare gtag to make it available to TypeScript for Google Analytics
declare var gtag: (command: string, targetId: string, config: { page_path: string }) => void;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  // Fix: Explicitly type the injected Router service.
  private router: Router = inject(Router);
  private launchPopupService = inject(LaunchPopupService);

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      window.scrollTo(0, 0);

      // Show popup on every page except the VBS 2026 page itself
      if (!event.urlAfterRedirects.includes('/vbs2026')) {
        this.launchPopupService.showIfNeeded();
      }

      if (typeof gtag === 'function') {
        gtag('config', 'G-21D02Q4E3B', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
