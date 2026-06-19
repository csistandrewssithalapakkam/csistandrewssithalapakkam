import { Component, ChangeDetectionStrategy, signal, inject, computed, effect } from '@angular/core';
import { MissionaryService } from './missionary.service';

@Component({
  selector: 'app-missionary-spotlight',
  imports: [],
  templateUrl: './missionary-spotlight.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionarySpotlightComponent {
  missionaryService = inject(MissionaryService);
  isPopupVisible = signal(false);
  currentLanguage = signal<'english' | 'tamil'>('english');

  spotlightStory = this.missionaryService.activeStory;

  showLanguageToggle = computed(() => {
    const story = this.spotlightStory();
    // Show toggle if both english and tamil versions are available for the short story.
    return !!(story && story.shortStoryEnglish && story.shortStoryTamil);
  });

  constructor() {
    effect(() => {
      const story = this.spotlightStory();
      if (story) {
        // Default to english if available, otherwise to tamil
        if (story.shortStoryEnglish) {
          this.currentLanguage.set('english');
        } else if (story.shortStoryTamil) {
          this.currentLanguage.set('tamil');
        }
      }
    });
  }
  
  openPopup(): void {
    const story = this.spotlightStory();
    if (story?.detailedStoryEnglish || story?.detailedStoryTamil) {
      this.isPopupVisible.set(true);
    }
  }

  closePopup(): void {
    this.isPopupVisible.set(false);
  }

  setLanguage(lang: 'english' | 'tamil') {
    this.currentLanguage.set(lang);
  }
}
