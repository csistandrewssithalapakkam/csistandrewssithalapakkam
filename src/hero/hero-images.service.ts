import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroImagesService {
  heroImages = signal<string[]>([


    // 'https://drive.google.com/thumbnail?id=1dRlWx8r3BP6d7nbe2q1Ti3VMpeYdeiDE&sz=w2000',
    'https://drive.google.com/thumbnail?id=13h9FjHj9UEVRYGs4pU8ZcdzfIPBFT2Xb&sz=w2000',
    'https://drive.google.com/thumbnail?id=1vJUtN6XL62szMenRTCq9Se0XvzqWQ2Dq&sz=w2000',

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