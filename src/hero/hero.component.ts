import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, OnDestroy {
  heroImages = signal([
    'https://picsum.photos/1920/1080?random=church',
    'https://picsum.photos/1920/1080?random=community',
    'https://picsum.photos/1920/1080?random=sunrise',
    'https://picsum.photos/1920/1080?random=nature',
  ]);
  currentHeroImageIndex = signal(0);
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImage() {
    this.currentHeroImageIndex.update((i) => (i + 1) % this.heroImages().length);
  }

  prevImage() {
    this.currentHeroImageIndex.update((i) => (i - 1 + this.heroImages().length) % this.heroImages().length);
  }

  selectImage(index: number) {
    this.currentHeroImageIndex.set(index);
  }
}