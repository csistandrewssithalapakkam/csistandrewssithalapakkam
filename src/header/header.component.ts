import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);

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
