import { PermissionService } from '../permission.service';
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { MissionaryService, NewMissionaryStoryPayload, MissionaryStory } from '../../missionary-spotlight/missionary.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-mission-manager',
  imports: [ReactiveFormsModule, ConfirmationModalComponent],
  templateUrl: './mission-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionManagerComponent implements OnInit {
  protected permissionService = inject(PermissionService);
  private fb: FormBuilder = inject(FormBuilder);
  missionaryService = inject(MissionaryService);

  isModalVisible = signal(false);
  isSubmitting = signal(false);
  editingStory = signal<MissionaryStory | null>(null);
  currentLanguageTab = signal<'english' | 'tamil'>('english');
  
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');
  imagePreview = signal<string | null>(null);

  // Signals for confirmation modal
  isConfirmModalVisible = signal(false);
  confirmAction = signal<{ action: 'activate', id: number } | null>(null);

  atLeastOneTitleValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const titleEnglish = group.controls['titleEnglish']?.value;
    const titleTamil = group.controls['titleTamil']?.value;
    return (titleEnglish || titleTamil) ? null : { atLeastOneTitleRequired: true };
  }

  storyForm = this.fb.group({
    titleEnglish: [''],
    shortStoryEnglish: ['', [Validators.maxLength(1000)]],
    detailedStoryEnglish: [''],
    titleTamil: [''],
    shortStoryTamil: ['', [Validators.maxLength(1000)]],
    detailedStoryTamil: [''],
    imageFile: [null as File | null], // Required for add, optional for edit
  }, { validators: this.atLeastOneTitleValidator });
  
  ngOnInit(): void {
    const setupConditionalValidators = (titleControlName: string, shortStoryControlName: string) => {
      const titleControl = this.storyForm.get(titleControlName)!;
      const shortStoryControl = this.storyForm.get(shortStoryControlName)!;

      titleControl.valueChanges.subscribe(value => {
        if (value) {
          shortStoryControl.setValidators([Validators.required, Validators.maxLength(1000)]);
        } else {
          shortStoryControl.setValidators([Validators.maxLength(1000)]);
        }
        shortStoryControl.updateValueAndValidity({ emitEvent: false });
      });
    };

    setupConditionalValidators('titleEnglish', 'shortStoryEnglish');
    setupConditionalValidators('titleTamil', 'shortStoryTamil');
    
    this.missionaryService.loadAllStories();
  }

  openModal(story: MissionaryStory | null = null) {
    this.editingStory.set(story);
    this.imagePreview.set(null);
    const imageFileControl = this.storyForm.get('imageFile')!;
    
    if (story) {
      // Edit mode
      this.storyForm.patchValue(story);
      this.imagePreview.set(story.imageUrl || null);
      imageFileControl.clearValidators();
    } else {
      // Add mode
      this.storyForm.reset();
      imageFileControl.setValidators(Validators.required);
    }
    imageFileControl.updateValueAndValidity();
    this.isModalVisible.set(true);
  }

  closeModal() {
    this.isModalVisible.set(false);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.storyForm.patchValue({ imageFile: file });
      this.storyForm.get('imageFile')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  saveStory() {
    this.storyForm.markAllAsTouched();
    if (this.storyForm.invalid) return;

    this.isSubmitting.set(true);

    if (this.editingStory()) {
      this.updateExistingStory();
    } else {
      this.createNewStory();
    }
  }
  
  private createNewStory() {
    const formValue = this.storyForm.getRawValue();
    const payload: NewMissionaryStoryPayload = {
      titleEnglish: formValue.titleEnglish || '',
      titleTamil: formValue.titleTamil || '',
      shortStoryEnglish: formValue.shortStoryEnglish || '',
      shortStoryTamil: formValue.shortStoryTamil || '',
      detailedStoryEnglish: formValue.detailedStoryEnglish || '',
      detailedStoryTamil: formValue.detailedStoryTamil || '',
      imageBase64: this.imagePreview() || ''
    };
    
    this.missionaryService.createStory(payload)
      .then(() => this.handleSuccess('Story added successfully!'))
      .catch(err => this.handleError('Failed to add story.', err))
      .finally(() => this.isSubmitting.set(false));
  }

  private updateExistingStory() {
    const initialStory = this.editingStory()!;
    const currentFormValue = this.storyForm.getRawValue();
    const payload: Partial<NewMissionaryStoryPayload> = {};

    // Compare and add changed fields to the payload
    if (currentFormValue.titleEnglish !== (initialStory.titleEnglish || '')) payload.titleEnglish = currentFormValue.titleEnglish || '';
    if (currentFormValue.titleTamil !== (initialStory.titleTamil || '')) payload.titleTamil = currentFormValue.titleTamil || '';
    if (currentFormValue.shortStoryEnglish !== (initialStory.shortStoryEnglish || '')) payload.shortStoryEnglish = currentFormValue.shortStoryEnglish || '';
    if (currentFormValue.shortStoryTamil !== (initialStory.shortStoryTamil || '')) payload.shortStoryTamil = currentFormValue.shortStoryTamil || '';
    if (currentFormValue.detailedStoryEnglish !== (initialStory.detailedStoryEnglish || '')) payload.detailedStoryEnglish = currentFormValue.detailedStoryEnglish || '';
    if (currentFormValue.detailedStoryTamil !== (initialStory.detailedStoryTamil || '')) payload.detailedStoryTamil = currentFormValue.detailedStoryTamil || '';
    if (this.imagePreview() && this.imagePreview() !== initialStory.imageUrl) payload.imageBase64 = this.imagePreview()!;

    if (Object.keys(payload).length === 0) {
      this.showToast('No changes were made.', 'success');
      this.closeModal();
      this.isSubmitting.set(false);
      return;
    }

    this.missionaryService.updateStory(initialStory.id, payload)
      .then(() => this.handleSuccess('Story updated successfully!'))
      .catch(err => this.handleError('Failed to update story.', err))
      .finally(() => this.isSubmitting.set(false));
  }

  private handleSuccess(message: string) {
    this.showToast(message, 'success');
    this.closeModal();
    this.missionaryService.loadAllStories();
  }

  private handleError(message: string, error: any) {
     console.error(message, error);
     this.showToast(`${message} Please try again.`, 'error');
  }

  activateStory(id: number) {
    this.confirmAction.set({ action: 'activate', id });
    this.isConfirmModalVisible.set(true);
  }
  
  handleConfirmAction() {
    const actionToConfirm = this.confirmAction();
    if (!actionToConfirm) return;

    if (actionToConfirm.action === 'activate') {
        this.missionaryService.activateStory(actionToConfirm.id)
            .then(() => this.handleSuccess('Story has been activated.'))
            .catch(err => this.handleError('Failed to activate story.', err));
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalVisible.set(false);
    this.confirmAction.set(null);
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
