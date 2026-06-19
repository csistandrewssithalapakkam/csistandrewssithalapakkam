import { PermissionService } from '../permission.service';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { GalleryService, GalleryCategory } from '../../gallery/gallery.service';
import { ImagePreviewComponent } from '../../image-preview/image-preview.component';
import { VideoPreviewComponent } from '../../video-preview/video-preview.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-gallery-manager',
  imports: [ReactiveFormsModule, ImagePreviewComponent, VideoPreviewComponent, ConfirmationModalComponent],
  templateUrl: './gallery-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryManagerComponent {
  protected permissionService = inject(PermissionService);
  private fb: FormBuilder = inject(FormBuilder);
  galleryService: GalleryService = inject(GalleryService);

  isAddCategoryModalVisible = signal(false);
  newCategoryForm = this.fb.group({
    name: ['', Validators.required],
  });

  selectedImageForPreview = signal<{ images: string[]; index: number } | null>(null);
  selectedVideoForPreview = signal<string | null>(null);

  addImageForm = this.fb.group({
    categoryName: ['', Validators.required],
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
  });

  // New signals for confirmation
  isConfirmModalVisible = signal(false);
  confirmAction = signal<{ categoryName: string; imageUrl: string } | null>(null);

  isGoogleVideo(url: string): boolean {
    return url.includes('drive.google.com/file/d/');
  }

  openAddCategoryModal() {
    this.isAddCategoryModalVisible.set(true);
    this.newCategoryForm.reset();
  }

  closeAddCategoryModal() {
    this.isAddCategoryModalVisible.set(false);
  }

  addNewCategory() {
    if (this.newCategoryForm.valid) {
      const { name } = this.newCategoryForm.getRawValue();
      this.galleryService.addCategory(name!);
      this.closeAddCategoryModal();
    }
  }

  openImagePreview(category: GalleryCategory, index: number) {
    const imagesOnly = category.images.filter(url => !this.isGoogleVideo(url));
    const currentUrl = category.images[index];
    const imageOnlyIndex = imagesOnly.indexOf(currentUrl);
    if(imageOnlyIndex > -1) {
      this.selectedImageForPreview.set({ images: imagesOnly, index: imageOnlyIndex });
    }
  }

  closeImagePreview() {
    this.selectedImageForPreview.set(null);
  }

  openVideoPreview(url: string) {
    if (this.isGoogleVideo(url)) {
      this.selectedVideoForPreview.set(url);
    }
  }

  closeVideoPreview() {
    this.selectedVideoForPreview.set(null);
  }

  addPhoto() {
    if (this.addImageForm.valid) {
      const { categoryName, imageUrl } = this.addImageForm.getRawValue();
      this.galleryService.addImage(categoryName!, imageUrl!);
      this.addImageForm.reset();
      this.addImageForm.controls.categoryName.setValue('');
    }
  }

  removePhoto(categoryName: string, imageUrl: string) {
    this.confirmAction.set({ categoryName, imageUrl });
    this.isConfirmModalVisible.set(true);
  }

  handleConfirmAction() {
    const action = this.confirmAction();
    if (action) {
      this.galleryService.removeImage(action.categoryName, action.imageUrl);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalVisible.set(false);
    this.confirmAction.set(null);
  }
}
