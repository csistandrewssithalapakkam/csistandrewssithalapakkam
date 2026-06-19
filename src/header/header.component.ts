import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { churchLogoUrl } from '../assets/logo';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Fix: Explicitly type the injected Router service.
  private router: Router = inject(Router);
  private routerSubscription?: Subscription;

  logo = churchLogoUrl;
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);
  isSubPage = signal(false);

  ngOnInit() {
    // Check initial state immediately in case the subscription fires after the first NavigationEnd event
    this.checkUrl(this.router.url);

    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkUrl(event.urlAfterRedirects);
      // Close mobile menu on navigation
      if(this.isMobileMenuOpen()) {
        this.isMobileMenuOpen.set(false);
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private checkUrl(url: string): void {
    // The main page route is '/', all others are sub-pages
    this.isSubPage.set(url !== '/');
  }

  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }
}
