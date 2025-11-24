import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryService, GalleryCategory } from '../gallery/gallery.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-gallery-page',
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    HeaderComponent,
    FooterComponent,
    ImagePreviewComponent,
  ],
  templateUrl: './gallery-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPageComponent {
  private galleryService = inject(GalleryService);
  galleryCategories = this.galleryService.galleryCategories;

  selectedCategoryForModal = signal<GalleryCategory | null>(null);
  selectedImageForPreview = signal<{ images: string[]; index: number } | null>(null);

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
