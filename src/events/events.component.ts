import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventsService, ChurchEvent } from './events.service';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-events',
  imports: [DatePipe, ImagePreviewComponent],
  templateUrl: './events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  private eventsService = inject(EventsService);
  selectedImageForPreview = signal<{ images: string[]; index: number } | null>(null);

  upcomingEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  recentEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  openImagePreview(clickedEvent: ChurchEvent, eventList: ChurchEvent[]) {
    if (!clickedEvent.image) return;
    
    const imagesWithUrls = eventList.filter(e => e.image);
    const images = imagesWithUrls.map(e => e.image!);
    const index = imagesWithUrls.findIndex(e => e.id === clickedEvent.id);

    if (index > -1) {
      this.selectedImageForPreview.set({ images, index });
    }
  }

  closeImagePreview() {
    this.selectedImageForPreview.set(null);
  }
}