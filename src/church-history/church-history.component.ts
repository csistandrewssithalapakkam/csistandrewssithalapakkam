import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface HistoryStage {
  stageTitle: string;
  stageTitleTamil: string;
  images: string[];
  verse: string;
  verseReference: string;
  verseTamil: string;
  verseReferenceTamil: string;
  description: string[];
  descriptionTamil: string[];
}

@Component({
  selector: 'app-church-history',
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './church-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChurchHistoryComponent {
  currentLanguage = signal<'english' | 'tamil'>('english');

  setLanguage(lang: 'english' | 'tamil') {
    this.currentLanguage.set(lang);
  }

  historyStages: HistoryStage[] = [
    {
      stageTitle: 'Stage - 1: The Day of Small Beginnings',
      stageTitleTamil: 'தோற்றம் - 1: அற்பமான ஆரம்பத்தின் நாள்',
      images: ['https://drive.google.com/thumbnail?id=1T7p6sN3qW3e5c9n7rJ1c5o4hXwJvF-yP&sz=w2000'],
      verse: "Who dares despise the day of small beginnings?",
      verseReference: "Zechariah 4:10",
      verseTamil: "அற்பமான ஆரம்பத்தின் நாளை யார் அசட்டைபண்ணலாம்?",
      verseReferenceTamil: "சகரியா 4:10",
      description: [
        "God delights in humble starts, transforms small efforts (like planting a seed) into great outcomes, and values faithfulness over immediate grandeur.",
        "This encourages perseverance, celebrating small wins, and trusting God's plan for growth, using examples like the tiny mustard seed or baby Jesus in Bethlehem. Key themes include spiritual eyes to see God's work, the power of consistent small steps, and the contrast between worldly estimates and God's view of humble beginnings."
      ],
      descriptionTamil: [
        "கடவுள் தாழ்மையான தொடக்கங்களில் மகிழ்ச்சியடைகிறார், சிறிய முயற்சிகளை (விதையை நடுவது போல) சிறந்த விளைவுகளாக மாற்றுகிறார்.",
        "உடனடி மகத்துவத்தை விட விசுவாசத்தை மதிக்கிறார், விடாமுயற்சியை ஊக்குவித்தல், சிறிய வெற்றிகளைக் கொண்டாடுதல் மற்றும் வளர்ச்சிக்கான கடவுளின் திட்டத்தை நம்புதல், சிறிய கடுகு விதை அல்லது பெத்லகேமில் குழந்தை இயேசு போன்ற உதாரணங்களைப் பயன்படுத்துகிறார்."
      ]
    },
    {
      stageTitle: 'Stage - 2: A Resting Place',
      stageTitleTamil: 'தோற்றம் - 2: தங்கும் இடம்',
      images: [
        'https://drive.google.com/thumbnail?id=1e5y_R7K5n2M6W9z7G2L5X9x5D4v8P-mD&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Q4v9r4O0Z4A5B7s2S6f6K3f7k4X9G-rC&sz=w2000'
      ],
      verse: "This is My resting place forever and ever; here I will dwell, for I have desired it.",
      verseReference: "Psalm 132:14",
      verseTamil: "இது என்றென்றைக்கும் நான் தங்கும் இடம்; இதை நான் விரும்பினபடியால், இங்கே வாசம்பண்ணுவேன்.",
      verseReferenceTamil: "சங்கீதம் 132:14",
      description: [
        "God Rejoices in the Start: God celebrates the act of beginning and faithfulness in small tasks, not just the final result.",
        "Faithfulness in the Little: Being faithful in small duties leads to greater responsibility (Matthew 25:21).",
        "Transformative Power: Small beginnings hold potential for greatness, like a mustard seed growing into a large plant, or an acorn into an oak."
      ],
      descriptionTamil: [
        "கர்த்தர் இறுதி முடிவை மட்டுமல்ல, சிறிய பணிகளின் தொடக்கத்தையும் உண்மையையும் கொண்டாடுகிறார், மகிழ்ச்சியடைகிறார்.",
        "சிறியவற்றில் உண்மைத்தன்மை: சிறிய கடமைகளில் உண்மையாக இருப்பது, அதிக பொறுப்புக்கு வழிவகுக்கிறது (மத்தேயு 25:21).",
        "மாற்றும் சக்தி: சிறிய தொடக்கங்கள் மகத்துவத்திற்கான ஆற்றலைக் கொண்டுள்ளன (கடுகு விதை - பெரிய செடி)."
      ]
    },
    {
      stageTitle: 'Stage - 3: Consecrated Forever',
      stageTitleTamil: 'தோற்றம் - 3: என்றென்றும் பரிசுத்தமாக்கப்பட்டது',
      images: ['https://drive.google.com/thumbnail?id=1w-R5hD9o4P2X4T8f6s3wX9x-Y9k9bV5z&sz=w2000'],
      verse: "For I have now chosen and consecrated this house, that my name may be there forever; and my eyes and my heart shall be there always.",
      verseReference: "2 Chronicles 7:16",
      verseTamil: "என் நாமம் இந்த ஆலயத்தில் என்றென்றைக்கும் இருக்கும்படி, நான் அதைத் தெரிந்துகொண்டு பரிசுத்தப்படுத்தினேன்; என் கண்களும் என் இருதயமும் எந்நாளும் இங்கே இருக்கும்.",
      verseReferenceTamil: "II நாளாகமம் 7:16",
      description: [],
      descriptionTamil: []
    },
    {
      stageTitle: 'Year 2021 vs. 2023: His Promise Fulfilled',
      stageTitleTamil: 'ஆண்டு 2021 vs. 2023: அவருடைய வாக்குறுதி நிறைவேறியது',
      images: [
        'https://drive.google.com/thumbnail?id=1Q4v9r4O0Z4A5B7s2S6f6K3f7k4X9G-rC&sz=w2000',
        'https://drive.google.com/thumbnail?id=1p2WQ4pNXWtkwq4IAdbA80_m0h-eKRil0&sz=w2000',
        'https://drive.google.com/thumbnail?id=1hXO0UIyqVToz8tfERrLVPDAo3uB5OwU1&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Vb6fCl16Hbu7YcWJLnQlV0an_244wggm&sz=w2000'
      ],
      verse: "what He spoke, He has done through His hands.",
      verseReference: "1 Kings 8:15",
      verseTamil: "அவர் தம்முடைய வாக்கினால் சொன்னதைத் தம்முடைய கரத்தினால் நிறைவேற்றினார்.",
      verseReferenceTamil: "I இராஜாக்கள் 8:15",
      description: [
        "These passages illustrate God's consistent action in making His spoken word a tangible reality, using His hands (representing power and action) and people to accomplish His purposes.",
        "God's faithfulness in bringing His spoken promises to pass through His actions. The phrase emphasizes that God's word is reliable and that He actively works to fulfil His purposes."
      ],
      descriptionTamil: [
        "தம்முடைய கைகள் (வல்லமை மற்றும் செயலைக் குறிக்கும்) மற்றும் மக்களை (தாவீது மற்றும் எரேமியாவைப் போல) தம்முடைய நோக்கங்களை நிறைவேற்றப் பயன்படுத்தி, தம்முடைய வார்த்தையை ஒரு உறுதியான யதார்த்தமாக்குவதில் கடவுளின் நிலையான செயலை இந்தப் பகுதிகள் விளக்குகின்றன.",
        "தம்முடைய வார்த்தைகளை தம்முடைய செயல்கள் மூலம் நிறைவேற்றுவதில் கடவுளின் உண்மைத்தன்மை. இந்த சொற்றொடர் கடவுளின் வார்த்தை நம்பகமானது என்றும், அவர் தம்முடைய நோக்கங்களை நிறைவேற்ற தீவிரமாக செயல்படுகிறார் என்றும் வலியுறுத்துகிறது."
      ]
    }
];
}
