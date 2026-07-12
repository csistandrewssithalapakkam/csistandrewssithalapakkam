import { Component, ChangeDetectionStrategy } from '@angular/core';

interface ServiceTime {
  category: string;
  items: { name: string; time: string }[];
}

@Component({
  selector: 'app-our-services',
  imports: [],
  templateUrl: './our-services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurServicesComponent {
  leftCardServices: ServiceTime[] = [
    {
      category: 'Sunday Morning Services',
      items: [
        { name: 'All Sundays', time: '8:30 a.m.' },
        { name: '1st Sunday (Holy Communion)', time: '8:30 a.m.' },
        { name: '4th Sunday (Holy Communion)', time: '9:00 a.m.' },
      ],
    },
    {
      category: 'Weekly Fellowships',
      items: [
        { name: 'Sunday School', time: 'All Sundays – 10:45 a.m.' },
        { name: 'Youth Fellowship', time: 'All Sundays – 10:45 a.m.' },
        { name: 'Men’s Fellowship', time: 'All Sundays – 10:45 a.m.' },
        { name: 'Young Couples Fellowship', time: 'All Sundays – 10:45 a.m.' },
        { name: "Women's Fellowship", time: 'All Saturday – 10:30 a.m.' },
      ],
    },
  ];

  rightCardServices: ServiceTime[] = [
    {
      category: 'Sunday Evening Service',
      items: [{ name: '1st Sunday', time: '6:30 p.m.' }],
    },
    {
      category: 'Monthly Prayers',
      items: [
        { name: 'Night prayer', time: '1st Friday - 10:00 p.m.' },
        { name: 'Fasting Prayer', time: '4th Saturday - 10:00 a.m.' },
      ],
    },
    {
      category: 'Other Gatherings',
      items: [
        { name: 'Prayer of Intercession', time: 'Every Friday - 7:00 p.m.' },
        {
          name: 'Sunday Service Preparatory Prayer',
          time: 'All Saturday – 7:00 p.m.',
        },
        { name: 'Friend’s Prayer Group(G-meet)', time: 'All Wednesday - 9:30 p.m.' },
        { name: 'Choir Practice', time: 'Every Sunday - 4:00 p.m.' },
      ],
    },
  ];
}