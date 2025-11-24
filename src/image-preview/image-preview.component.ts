import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-preview',
  imports: [NgOptimizedImage],
  templateUrl: './image-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePreviewComponent {
  images = input.required<string[]>();
  startIndex = input.required<number>();
  close = output<void>();

  currentIndex = signal(0);

  constructor() {
    effect(() => {
      this.currentIndex.set(this.startIndex());
    });
  }

  nextImage() {
    this.currentIndex.update(i => (i + 1) % this.images().length);
  }

  prevImage() {
    this.currentIndex.update(i => (i - 1 + this.images().length) % this.images().length);
  }

  onClose() {
    this.close.emit();
  }
}
