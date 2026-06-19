import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { MilestoneVerseService } from './milestone-verse.service';

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
  milestoneVerseService = inject(MilestoneVerseService);

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
