import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroImagesService {
  heroImages = signal<string[]>([
    'https://drive.google.com/thumbnail?id=1yQ84TfWeYITFjx-SJybr5MzeD5UZtJZM&sz=w2000',
    'https://drive.google.com/thumbnail?id=101BnKL2SDR22HLnPYzE2621L_C2BCnsR&sz=w2000',
    'https://drive.google.com/thumbnail?id=1p2WQ4pNXWtkwq4IAdbA80_m0h-eKRil0&sz=w2000'
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