import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink],
  templateUrl: './about-us.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {
  currentLanguage = signal<'english' | 'tamil'>('english');

  setLanguage(lang: 'english' | 'tamil') {
    this.currentLanguage.set(lang);
  }
}