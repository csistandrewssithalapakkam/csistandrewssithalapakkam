import { Component, ChangeDetectionStrategy, signal, inject, computed, effect } from '@angular/core';
import { VerseService } from './verse.service';

@Component({
  selector: 'app-daily-verse',
  imports: [],
  templateUrl: './daily-verse.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyVerseComponent {
  verseService = inject(VerseService); // Make service public for template access
  currentLanguage = signal<'english' | 'tamil'>('english');

  showLanguageToggle = computed(() => {
    const verse = this.verseService.verse();
    // Only show toggle if both English and Tamil quotes exist and are not empty
    return !!(verse && verse.quote && verse.quoteTamil);
  });

  constructor() {
    effect(() => {
      const verse = this.verseService.verse();
      if (verse) {
        // If English verse is missing/empty but Tamil exists, default to Tamil
        if (!verse.quote && verse.quoteTamil) {
          this.currentLanguage.set('tamil');
        } else {
          // Otherwise, default to English
          this.currentLanguage.set('english');
        }
      }
    });
  }

  setLanguage(lang: 'english' | 'tamil') {
    this.currentLanguage.set(lang);
  }
}
