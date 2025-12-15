import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { GalleryService, GalleryCategory } from '../../gallery/gallery.service';
import { ImagePreviewComponent } from '../../image-preview/image-preview.component';

@Component({
  selector: 'app-gallery-manager',
  imports: [ReactiveFormsModule, ImagePreviewComponent],
  templateUrl: './gallery-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryManagerComponent {
  private fb: FormBuilder = inject(FormBuilder);
  galleryService: GalleryService = inject(GalleryService);

  isAddCategoryModalVisible = signal(false);
  newCategoryForm = this.fb.group({
    name: ['', Validators.required],
  });

  selectedImageForPreview = signal<{ images: string[]; index: number } | null>(null);

  addImageForm = this.fb.group({
    categoryName: ['', Validators.required],
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
  });

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
    this.selectedImageForPreview.set({ images: category.images, index });
  }

  closeImagePreview() {
    this.selectedImageForPreview.set(null);
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
    if (confirm('Are you sure you want to delete this photo?')) {
      this.galleryService.removeImage(categoryName, imageUrl);
    }
  }
}