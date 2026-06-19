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
  private nextId = 14;
  events = signal<ChurchEvent[]>([
    // Upcoming Events
    {
      id: 13,
      title: 'VBS 2026 – Come to Jesus',
      date: new Date('2026-04-25T09:00:00'),
      description:
        'Vacation Bible School 2026 at C.S.I. St. Andrew\'s Church, Sithalapakkam. Theme: "Come to Jesus / இயேசுவிடம் வாருங்கள்". 25 Apr – 02 May 2026, 9:00 AM – 1:00 PM. All children are welcome!',
      image: 'https://drive.google.com/thumbnail?id=1bIpTXV4ovSLUfj3hrmDJS95UoXs2BK_P&sz=w2000'
    },
    {
      id: 12,
      title: 'Lenten Revival Meetings',
      date: new Date('2026-03-14T18:30:00'),
      description:
        'Lenten Revival Meetings at CSI St. Andrew’s Church, Sithalapakkam. Join on March 14 & 15 at 6:30 PM. Message by Rev. Sis. Epsiya Samuel and chaired by Rev. Abinath Selvakumar. Come with prayer, abide in the love of Jesus, and receive blessings.',
      image: 'https://drive.google.com/thumbnail?id=1YL7egXVcJ6w9nlF5qET_qWZn86AaobOb&sz=w2000'
    },
    {
      id: 6,
      title: 'Couple retreat 2025',
      date: new Date('2025-11-29T10:00:00'),
      description:
        "Join the Couple retreat 2025 at CSI. St. John's Church, Medavakkam.",
      image: 'https://drive.google.com/thumbnail?id=1FcPKS2srmGuA67gL7TvXPh98Ff85k4ct&sz=w2000'
    },
    {
      id: 7,
      title: "Men's Fellowship Annual retreat 2025",
      date: new Date('2025-10-25T10:00:00'),
      description: "Join the Men's Fellowship Annual retreat 2025 at Padappai.",
      image: 'https://drive.google.com/thumbnail?id=1uu1TpPno7-WP13r3Okjh22uptsees9Pc&sz=w2000'
    },
    {
      id: 8,
      title: 'CHRISTMAS CAROL - Zone 1',
      date: new Date('2025-12-05T10:00:00'),
      description: 'Area - Medavakkam, Adambakkam, Pallikaranai, Veerabadran Nagar, Perumbakkam',
      image: 'https://drive.google.com/thumbnail?id=1jTEb_Fjz0j86WIwC4og1cqukRvDy3LWM&sz=w2000'
    },
    {
      id: 9,
      title: 'CHRISTMAS CAROL - Zone 2',
      date: new Date('2025-12-08T10:00:00'),
      description: 'Area - Kovilanchery, Mambakkam, Ponmar -1, Madurapakkam',
      image: 'https://drive.google.com/thumbnail?id=1jTEb_Fjz0j86WIwC4og1cqukRvDy3LWM&sz=w2000'
    },
    {
      id: 10,
      title: 'CHRISTMAS CAROL - Zone 3',
      date: new Date('2025-12-10T10:00:00'),
      description: 'Area - Ponmar -2, Vengadamangalam, Kandigai, Semancheri, Navalur, Sholinganallur, Karapakkam',
      image: 'https://drive.google.com/thumbnail?id=1jTEb_Fjz0j86WIwC4og1cqukRvDy3LWM&sz=w2000'
    },
    {
      id: 11,
      title: 'CHRISTMAS CAROL - Zone 4',
      date: new Date('2025-12-12T10:00:00'),
      description: 'Area - Sithalapakkam, Vengaivasal, Valluvar nagar, Thiruvanchery, Tambaram, Selaiyur, Sembakkam, Palaniappa Nagar',
      image: 'https://drive.google.com/thumbnail?id=1jTEb_Fjz0j86WIwC4og1cqukRvDy3LWM&sz=w2000'
    },
    {
      id: 12,
      title: 'CHRISTMAS CAROL - Zone 5',
      date: new Date('2025-12-17T10:00:00'),
      description: 'Area - TNHB Sithalapakkam',
      image: 'https://drive.google.com/thumbnail?id=1jTEb_Fjz0j86WIwC4og1cqukRvDy3LWM&sz=w2000'
    }
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