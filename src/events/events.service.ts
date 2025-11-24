import { Injectable, signal } from '@angular/core';

export interface ChurchEvent {
  id: number;
  title: string;
  date: Date;
  description: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private nextId = 4;
  events = signal<ChurchEvent[]>([
    {
      id: 1,
      image: 'https://picsum.photos/600/400?random=4',
      title: 'Community Picnic',
      date: this.getDateInFuture(7), // 7 days from now
      description:
        'Join us for a day of fun, food, and fellowship at Central Park. All are welcome!',
    },
    {
      id: 2,
      image: 'https://picsum.photos/600/400?random=5',
      title: 'Youth Group Retreat',
      date: this.getDateInFuture(20), // 20 days from now
      description:
        'An amazing weekend retreat for our youth to grow in faith and build friendships.',
    },
    {
      id: 3,
      title: 'Worship Night',
      date: this.getDateInPast(10), // 10 days ago
      description:
        'A special night dedicated to worship, prayer, and reflection. Come lift your voice with us.',
    },
  ]);

  private getDateInFuture(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  private getDateInPast(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  addEvent(eventData: Omit<ChurchEvent, 'id'>) {
    const newEvent: ChurchEvent = { ...eventData, id: this.nextId++ };
    this.events.update(events => [...events, newEvent]);
  }

  updateEvent(updatedEvent: ChurchEvent) {
    this.events.update(events =>
      events.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
  }

  deleteEvent(id: number) {
    this.events.update(events => events.filter(event => event.id !== id));
  }
}
