import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NgOptimizedImage, DatePipe } from '@angular/common';
import { EventsService } from './events.service';

@Component({
  selector: 'app-events',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  private eventsService = inject(EventsService);
  private today = new Date();

  upcomingEvents = computed(() => {
    this.today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => event.date >= this.today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  recentEvents = computed(() => {
    this.today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => event.date < this.today)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  });
}