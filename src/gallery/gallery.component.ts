import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GalleryService, GalleryCategory } from './gallery.service';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink, ImagePreviewComponent, VideoPreviewComponent],
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private galleryService = inject(GalleryService);
  galleryCategories = this.galleryService.galleryCategories;

  selectedCategoryForModal = signal<GalleryCategory | null>(null);
  selectedImageForPreview = signal<{ images: string[]; index: number } | null>(null);
  selectedVideoForPreview = signal<string | null>(null);

  visibleCategories = computed(() => {
    return this.galleryCategories().slice(0, 3);
  });

  isGoogleVideo(url: string): boolean {
    return url.includes('drive.google.com/file/d/');
  }

  openVideoPreview(url: string) {
    if (this.isGoogleVideo(url)) {
      this.selectedVideoForPreview.set(url);
    }
  }

  closeVideoPreview() {
    this.selectedVideoForPreview.set(null);
  }

  openCategoryModal(category: GalleryCategory) {
    this.selectedCategoryForModal.set(category);
  }

  closeCategoryModal() {
    this.selectedCategoryForModal.set(null);
  }

  openImagePreview(images: string[], index: number) {
    const imageOnlyUrls = images.filter(url => !this.isGoogleVideo(url));
    const currentImageUrl = images[index];
    const imageOnlyIndex = imageOnlyUrls.indexOf(currentImageUrl);

    if (imageOnlyIndex > -1) {
      this.selectedImageForPreview.set({ images: imageOnlyUrls, index: imageOnlyIndex });
    }
  }

  closeImagePreview() {
    this.selectedImageForPreview.set(null);
  }
}
