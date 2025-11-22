import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-daily-verse',
  standalone: true,
  templateUrl: './daily-verse.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyVerseComponent {
  private verses = [
    {
      ref: 'John 3:16',
      english:
        'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      tamil:
        'பூமியை அவன் அவருக்குள் மிகவும் நேசித்ததால், ஒரே மகன் கொடுத்தார்; அவனை நம்பினால் அழிவு அடையாமல் நித்திய வாழ்வு பெறுவார்.',
    },
    {
      ref: 'Psalm 23:1',
      english: 'The LORD is my shepherd; I shall not want.',
      tamil: 'கடவுள் என் மேய்ப்பாளர்; எனக்கு யாதனமும் குறைவே இல்லை.',
    },
    {
      ref: 'Philippians 4:13',
      english: 'I can do all things through Christ who strengthens me.',
      tamil: 'என்னை வலுப்படுத்தும் கிரிஸ்துவால் நான் அனைத்தையும் செய்ய முடியும்.',
    },
    {
      ref: 'Romans 8:28',
      english:
        'And we know that in all things God works for the good of those who love him.',
      tamil: 'எல்லா விஷயங்களிலும் தேவன் அவரைப் பிடிக்கும் மக்களுக்கு நல்லதிற்காக செயல்படுவார் என்பதை நாமறிந்துள்ளோம்.',
    },
    {
      ref: 'Proverbs 3:5',
      english:
        'Trust in the LORD with all your heart and lean not on your own understanding;',
      tamil: 'உன் முழு மனதுடனும் ஆண்டவரில் நம்பிக்கை வையுங்கள்; உன் அறிவினை பொறுத்துக் கொள்ளாதே.',
    },
    {
      ref: 'Matthew 11:28',
      english:
        'Come to me, all you who are weary and burdened, and I will give you rest.',
      tamil: 'அழுத்தத்தில் உள்ள அனைவரும் என்னிடம் வாருங்கள்; நான் உங்களுக்கு ஓய்வு தருவேன்.',
    },
    {
      ref: 'Isaiah 41:10',
      english: 'Fear not, for I am with you; be not dismayed, for I am your God.',
      tamil: 'பயப்பட வேண்டாம்; நான் உன்னுடன் இருக்கிறேன்; கவலைப்படாதே; நான் உன் கடவுள்.',
    },
  ];

  get verse() {
    const days = Math.floor(Date.now() / 86400000);
    const index = days % this.verses.length;
    return this.verses[index];
  }

  get dateStr() {
    return new Date().toLocaleDateString();
  }
}
