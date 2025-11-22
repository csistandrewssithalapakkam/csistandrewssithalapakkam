import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-events',
  imports: [NgOptimizedImage],
  templateUrl: './events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  upcomingEvents = [
    {
      image: 'https://picsum.photos/600/400?random=4',
      title: 'Community Picnic',
      date: 'Saturday, August 24th @ 12:00 PM',
      description:
        'Join us for a day of fun, food, and fellowship at Central Park. All are welcome!',
    },
    {
      image: 'https://picsum.photos/600/400?random=5',
      title: 'Youth Group Retreat',
      date: 'Friday, September 6th - Sunday, September 8th',
      description:
        'An amazing weekend retreat for our youth to grow in faith and build friendships.',
    },
    {
      image: 'https://picsum.photos/600/400?random=6',
      title: 'Worship Night',
      date: 'Wednesday, September 18th @ 7:00 PM',
      description:
        'A special night dedicated to worship, prayer, and reflection. Come lift your voice with us.',
    },
  ];
}
