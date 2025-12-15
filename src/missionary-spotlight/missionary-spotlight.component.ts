import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { MissionaryService } from './missionary.service';

@Component({
  selector: 'app-missionary-spotlight',
  imports: [],
  templateUrl: './missionary-spotlight.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionarySpotlightComponent {
  private missionaryService = inject(MissionaryService);
  isPopupVisible = signal(false);
  currentLanguage = signal<'english' | 'tamil'>('english');

  spotlightStory = computed(() => {
    const stories = this.missionaryService.stories();
    const currentMonth = new Date().getMonth();

    // Find story for current month
    const storyForMonth = stories.find(s => s.mappedMonth === currentMonth);
    if (storyForMonth) {
      return storyForMonth;
    }

    // Fallback: find the first unmapped story
    const firstUnmapped = stories.find(s => s.mappedMonth === undefined);
    if (firstUnmapped) {
      return firstUnmapped;
    }

    // Fallback: just return the first story if no other match
    return stories.length > 0 ? stories[0] : null;
  });

  setLanguage(lang: 'english' | 'tamil') {
    this.currentLanguage.set(lang);
  }

  openPopup(): void {
    if (this.spotlightStory()?.detailedStory || this.spotlightStory()?.detailedStoryTamil) {
      this.isPopupVisible.set(true);
    }
  }

  closePopup(): void {
    this.isPopupVisible.set(false);
  }
}