import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface Milestone {
  name: string;
  date: string;
}

@Component({
  selector: 'app-milestones',
  imports: [],
  templateUrl: './milestones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestonesComponent {
  commonVerse = {
    quote:
      '"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you."',
    reference: 'Numbers 6:24-25',
    quoteTamil:
      '"கர்த்தர் உன்னை ஆசீர்வதித்து, உன்னைக் காக்கக்கடவர்; கர்த்தர் தம்முடைய முகத்தை உன்மேல் பிரகாசிக்கப்பண்ணி, உன்மேல் கிருபையாயிருக்கக்கடவர்."',
    referenceTamil: 'எண்ணாகமம் 6:24-25',
  };

  birthdays = signal<Milestone[]>([
    {
      name: 'Alice Johnson',
      date: 'August 19th',
    },
    {
      name: 'David Smith',
      date: 'August 21st',
    },
  ]);

  anniversaries = signal<Milestone[]>([
    {
      name: 'Michael & Sarah Miller',
      date: 'August 20th',
    },
    {
      name: 'James & Emily Brown',
      date: 'August 22nd',
    },
  ]);
}
