import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { HeroImagesService } from './hero-images.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, OnDestroy {
  private heroImagesService = inject(HeroImagesService);
  heroImages = this.heroImagesService.heroImages;
  currentHeroImageIndex = signal(0);
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit() {
    if (this.heroImages().length > 0) {
      this.intervalId = setInterval(() => {
        this.nextImage();
      }, 5000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImage() {
    if (this.heroImages().length === 0) return;
    this.currentHeroImageIndex.update(
      (i) => (i + 1) % this.heroImages().length
    );
  }

  prevImage() {
    if (this.heroImages().length === 0) return;
    this.currentHeroImageIndex.update(
      (i) => (i - 1 + this.heroImages().length) % this.heroImages().length
    );
  }

  selectImage(index: number) {
    this.currentHeroImageIndex.set(index);
  }
}