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
  private nextId = 8;
  events = signal<ChurchEvent[]>([
    // Upcoming Events
    {
      id: 1,
      title: "Women's Fellowship Carol Service",
      date: new Date('2025-12-14T18:00:00'),
      description:
        "The Women's Fellowship leads us in a special carol service filled with grace and beautiful music.",
    },
    {
      id: 2,
      title: 'Christmas Carols',
      date: new Date('2025-12-11T19:00:00'),
      description:
        "Our final community carol service for the season at TNHB. Don't miss this special night of worship.",
    },
    {
      id: 3,
      title: 'Christmas Carols',
      date: new Date('2025-12-07T19:00:00'),
      description:
        "A second evening to enjoy the wonderful sounds of Christmas and the story of our Savior's birth at Place 2.",
    },
    {
      id: 4,
      title: 'Christmas Carols',
      date: new Date('2025-12-05T19:00:00'),
      description:
        'Join us for a beautiful evening of traditional Christmas carols at Place 3 as we celebrate the season.',
    },
    {
      id: 5,
      title: 'Sunday School Carol Service',
      date: new Date('2025-12-07T17:00:00'),
      description:
        'Our talented Sunday School children present their annual Christmas Carol service. A heartwarming event for the whole family.',
    },
    {
      id: 6,
      title: 'Couple retreat 2025',
      date: new Date('2025-11-29T10:00:00'),
      description:
        'Join the Couple retreat 2025 at CSI st paul church Medavakkam.',
      image: 'https://drive.google.com/thumbnail?id=1FcPKS2srmGuA67gL7TvXPh98Ff85k4ct&sz=w2000'
    },
    {
      id: 7,
      title: "Men's Fellowship Annual retreat 2025",
      date: new Date('2025-10-25T10:00:00'),
      description: 'Join the MensFellowship Annual retreat 2025 at Padappai.',
      image: 'https://drive.google.com/thumbnail?id=1uu1TpPno7-WP13r3Okjh22uptsees9Pc&sz=w2000'
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
    this.events.update((events) => [...events, newEvent]);
  }

  updateEvent(updatedEvent: ChurchEvent) {
    this.events.update((events) =>
      events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  }

  deleteEvent(id: number) {
    this.events.update((events) => events.filter((event) => event.id !== id));
  }
}