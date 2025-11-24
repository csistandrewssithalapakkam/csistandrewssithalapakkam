import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryService, GalleryCategory } from './gallery.service';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-gallery',
  imports: [NgOptimizedImage, RouterLink, ImagePreviewComponent],
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private galleryService = inject(GalleryService);
  galleryCategories = this.galleryService.galleryCategories;

  selectedCategoryForModal = signal<GalleryCategory | null>(null);
  selectedImageForPreview = signal<{ images: string[]; index: number } | null>(null);

  visibleCategories = computed(() => {
    return this.galleryCategories().slice(0, 3);
  });

  openCategoryModal(category: GalleryCategory) {
    this.selectedCategoryForModal.set(category);
  }

  closeCategoryModal() {
    this.selectedCategoryForModal.set(null);
  }

  openImagePreview(images: string[], index: number) {
    this.selectedImageForPreview.set({ images, index });
  }

  closeImagePreview() {
    this.selectedImageForPreview.set(null);
  }
}
