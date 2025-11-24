import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface Milestone {
  name: string;
  date: string;
  quote: string;
  reference: string;
  quoteTamil: string;
  referenceTamil: string;
}

@Component({
  selector: 'app-milestones',
  imports: [],
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
      quoteTamil: '"கர்த்தர் உன்னை ஆசீர்வதித்து, உன்னைக் காக்கக்கடவர்; கர்த்தர் தம்முடைய முகத்தை உன்மேல் பிரகாசிக்கப்பண்ணி, உன்மேல் கிருபையாயிருக்கக்கடவர்."',
      referenceTamil: 'எண்ணாகமம் 6:24-25',
    },
    {
      name: 'David Smith',
      date: 'August 21st',
      quote:
        '"For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future."',
      reference: 'Jeremiah 29:11',
      quoteTamil: '"நீங்கள் எதிர்பார்த்திருக்கும் முடிவை உங்களுக்குக் கொடுக்கும்படிக்கு நான் உங்கள்மேல் வைத்திருக்கிற நினைவுகளை அறிவேன் என்று கர்த்தர் சொல்லுகிறார், அவைகள் தீமைக்கல்ல, சமாதானத்துக்கேதுவான நினைவுகளே."',
      referenceTamil: 'எரேமியா 29:11',
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
      quoteTamil: '"ஒண்டியாயிருப்பதிலும் இருவர் கூடியிருப்பது நலம்... முப்புரிநூல் சீக்கிரமாய் அறாது."',
      referenceTamil: 'பிரசங்கி 4:9, 12',
    },
    {
      name: 'James & Emily Brown',
      date: 'August 22nd',
      quote: '"Therefore what God has joined together, let no one separate."',
      reference: 'Mark 10:9',
      quoteTamil: '"ஆகையால், தேவன் இணைத்ததை மனுஷன் பிரிக்காதிருக்கக்கடவர்."',
      referenceTamil: 'மாற்கு 10:9',
    },
  ]);
  currentAnniversaryIndex = signal(0);

  displayLanguage = signal<'english' | 'tamil' | 'both'>('both');

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
