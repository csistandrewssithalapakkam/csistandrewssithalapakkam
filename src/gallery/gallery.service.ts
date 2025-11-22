import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  galleryImages = signal<string[]>([
    'https://picsum.photos/800/600?random=10',
    'https://picsum.photos/600/800?random=11',
    'https://picsum.photos/800/600?random=12',
    'https://picsum.photos/800/600?random=13',
    'https://picsum.photos/600/800?random=14',
    'https://picsum.photos/800/600?random=15',
  ]);

  addImage(imageUrl: string) {
    if (imageUrl) {
      this.galleryImages.update((images) => [...images, imageUrl]);
    }
  }
}
