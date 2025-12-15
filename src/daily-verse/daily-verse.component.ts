import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { VerseService } from './verse.service';

@Component({
  selector: 'app-daily-verse',
  imports: [],
  templateUrl: './daily-verse.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyVerseComponent {
  private verseService = inject(VerseService);
  dailyVerse = this.verseService.dailyVerse;
  currentLanguage = signal<'english' | 'tamil'>('english');

  setLanguage(lang: 'english' | 'tamil') {
    this.currentLanguage.set(lang);
  }
}