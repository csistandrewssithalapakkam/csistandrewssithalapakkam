import { PermissionService } from '../permission.service';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { HeroImagesService } from '../../hero/hero-images.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-banner-manager',
  imports: [ReactiveFormsModule, NgOptimizedImage, ConfirmationModalComponent],
  templateUrl: './banner-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerManagerComponent {
  protected permissionService = inject(PermissionService);
  private fb: FormBuilder = inject(FormBuilder);
  heroImagesService = inject(HeroImagesService);

  addImageForm = this.fb.group({
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
  });

  // New signals for confirmation
  isConfirmModalVisible = signal(false);
  confirmAction = signal<{ imageUrl: string } | null>(null);

  addPhoto() {
    if (this.addImageForm.valid) {
      const { imageUrl } = this.addImageForm.getRawValue();
      this.heroImagesService.addImage(imageUrl!);
      this.addImageForm.reset();
    }
  }

  removePhoto(imageUrl: string) {
    this.confirmAction.set({ imageUrl });
    this.isConfirmModalVisible.set(true);
  }

  handleConfirmAction() {
    const action = this.confirmAction();
    if (action) {
      this.heroImagesService.removeImage(action.imageUrl);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalVisible.set(false);
    this.confirmAction.set(null);
  }
}
