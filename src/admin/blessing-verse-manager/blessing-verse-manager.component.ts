import { PermissionService } from '../permission.service';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BlessingVerseService, NewBlessingVerse } from './blessing-verse.service';

@Component({
  selector: 'app-blessing-verse-manager',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './blessing-verse-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlessingVerseManagerComponent {
  protected permissionService = inject(PermissionService);
  private fb: FormBuilder = inject(FormBuilder);
  blessingVerseService = inject(BlessingVerseService); // public for template access

  isAddVerseModalVisible = signal(false);
  isSubmitting = signal(false);
  
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  addVerseForm = this.fb.group({
    Verses_english: ['', Validators.required],
    Loc_english: ['', Validators.required],
    Verses_tamil: ['', Validators.required],
    Loc_tamil: ['', Validators.required],
  });

  openAddVerseModal() {
    this.addVerseForm.reset();
    this.isAddVerseModalVisible.set(true);
  }

  closeAddVerseModal() {
    this.isAddVerseModalVisible.set(false);
  }

  saveVerse() {
    if (this.addVerseForm.invalid || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);

    const verseData: NewBlessingVerse = this.addVerseForm.getRawValue() as NewBlessingVerse;
    
    this.blessingVerseService.addVerse(verseData)
      .then(() => {
        this.showToast('Blessing verse added successfully.', 'success');
        this.closeAddVerseModal();
        this.blessingVerseService.loadRecentVerses();
      })
      .catch(err => {
        console.error('Failed to add verse:', err);
        this.showToast('Failed to add verse. Please try again.', 'error');
      })
      .finally(() => {
        this.isSubmitting.set(false);
      });
  }
  
  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
