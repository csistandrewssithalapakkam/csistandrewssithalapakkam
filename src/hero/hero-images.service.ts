import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroImagesService {
  heroImages = signal<string[]>([
    'https://picsum.photos/1920/1080?random=church',
    'https://picsum.photos/1920/1080?random=community',
    'https://picsum.photos/1920/1080?random=sunrise',
    'https://picsum.photos/1920/1080?random=nature',
  ]);

  addImage(url: string) {
    if (url && !this.heroImages().includes(url)) {
      this.heroImages.update(images => [...images, url]);
    }
  }

  removeImage(url: string) {
    this.heroImages.update(images => images.filter(img => img !== url));
  }
}
