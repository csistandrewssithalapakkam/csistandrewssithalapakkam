import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MissionaryService } from '../../missionary-spotlight/missionary.service';

@Component({
  selector: 'app-mission-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './mission-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionManagerComponent {
  private fb: FormBuilder = inject(FormBuilder);
  missionaryService = inject(MissionaryService);

  isModalVisible = signal(false);
  filter = signal<'all' | 'mapped' | 'unmapped'>('all');
  
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  storyForm = this.fb.group({
    title: ['', Validators.required],
    imageUrl: ['', [Validators.pattern('https?://.+')]],
    shortStory: ['', [Validators.required, Validators.maxLength(1000)]],
    detailedStory: [''],
    mappedMonth: [''],
  });

  filteredStories = computed(() => {
    const stories = this.missionaryService.stories();
    const currentFilter = this.filter();
    let filtered = stories;

    if (currentFilter === 'mapped') {
      filtered = stories.filter(s => s.mappedMonth !== undefined && s.mappedMonth !== null);
    } else if (currentFilter === 'unmapped') {
      filtered = stories.filter(s => s.mappedMonth === undefined || s.mappedMonth === null);
    }

    return [...filtered].sort((a, b) => {
      const aIsUnmapped = a.mappedMonth === undefined || a.mappedMonth === null;
      const bIsUnmapped = b.mappedMonth === undefined || b.mappedMonth === null;
      if (aIsUnmapped && !bIsUnmapped) return -1;
      if (!aIsUnmapped && bIsUnmapped) return 1;
      return 0;
    });
  });
  
  openModal() {
    this.storyForm.reset({ mappedMonth: '' });
    this.isModalVisible.set(true);
  }

  closeModal() {
    this.isModalVisible.set(false);
  }

  saveStory() {
    if (this.storyForm.invalid) {
      return;
    }
    const formValue = this.storyForm.getRawValue();
    const storyData = {
        title: formValue.title!,
        imageUrl: formValue.imageUrl || undefined,
        shortStory: formValue.shortStory!,
        detailedStory: formValue.detailedStory || undefined,
        mappedMonth: formValue.mappedMonth ? parseInt(formValue.mappedMonth, 10) : undefined,
    };

    // Very basic check to ensure month is valid if provided
    if (storyData.mappedMonth !== undefined && (storyData.mappedMonth < 0 || storyData.mappedMonth > 11)) {
        storyData.mappedMonth = undefined;
    }
    
    this.missionaryService.addStory(storyData);
    this.closeModal();
  }
}