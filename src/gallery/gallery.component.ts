import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { GalleryService } from './gallery.service';

@Component({
  selector: 'app-gallery',
  imports: [NgOptimizedImage],
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private galleryService = inject(GalleryService);
  galleryImages = this.galleryService.galleryImages;
}
