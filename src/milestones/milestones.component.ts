import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface Milestone {
  name: string;
  date: string;
  quote: string;
  reference: string;
}

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestonesComponent {
  birthdays = signal<Milestone[]>([
    {
      name: 'Alice Johnson',
      date: 'August 19th',
      quote:
        '"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you."',
      reference: 'Numbers 6:24-25',
    },
    {
      name: 'David Smith',
      date: 'August 21st',
      quote:
        '"For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future."',
      reference: 'Jeremiah 29:11',
    },
  ]);
  currentBirthdayIndex = signal(0);

  anniversaries = signal<Milestone[]>([
    {
      name: 'Michael & Sarah Miller',
      date: 'August 20th',
      quote:
        '"Two are better than one... A cord of three strands is not quickly broken."',
      reference: 'Ecclesiastes 4:9, 12',
    },
    {
      name: 'James & Emily Brown',
      date: 'August 22nd',
      quote: '"Therefore what God has joined together, let no one separate."',
      reference: 'Mark 10:9',
    },
  ]);
  currentAnniversaryIndex = signal(0);

  nextMilestone(type: 'birthday' | 'anniversary') {
    if (type === 'birthday') {
      this.currentBirthdayIndex.update((i) => (i + 1) % this.birthdays().length);
    } else {
      this.currentAnniversaryIndex.update(
        (i) => (i + 1) % this.anniversaries().length
      );
    }
  }

  prevMilestone(type: 'birthday' | 'anniversary') {
    if (type === 'birthday') {
      this.currentBirthdayIndex.update(
        (i) => (i - 1 + this.birthdays().length) % this.birthdays().length
      );
    } else {
      this.currentAnniversaryIndex.update(
        (i) =>
          (i - 1 + this.anniversaries().length) % this.anniversaries().length
      );
    }
  }
}
