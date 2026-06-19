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
      images: ['https://drive.google.com/thumbnail?id=1h6i2eJ_nuKlpIT8xb_LWGHIZf0o24Ak0&sz=w2000'],
      verse: "Who dares despise the day of small beginnings?",
      verseReference: "Zechariah 4:10",
      verseTamil: "அற்பமான ஆரம்பத்தின் நாளை யார் அசட்டைபண்ணலாம்?",
      verseReferenceTamil: "சகரியா 4:10",
      description: [
        "As seen in the picture, the place was used as a yard for wastage in its early days.",
        "Through the prayers of the believers, God gracefully helped to build a small tabernacle in that place.",
        "God delights in humble starts, transforms small efforts (like planting a seed) into great outcomes, and values faithfulness over immediate grandeur, encouraging perseverance, celebrating small wins, and trusting God's plan for growth. Key themes include spiritual eyes to see God's work, the power of consistent small steps, and the contrast between worldly estimates and God's view of humble beginnings."
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
        'https://drive.google.com/thumbnail?id=1Hh5NLCDzozoYeZTeOSTnV7KSt_qo8lU3&sz=w2000',
        'https://drive.google.com/thumbnail?id=1FOaVmB1HnMtIxVwnocRW3Ol4RY5Dn_hC&sz=w2000'
      ],
      verse: "This is My resting place forever and ever; here I will dwell, for I have desired it.",
      verseReference: "Psalm 132:14",
      verseTamil: "இது என்றென்றைக்கும் நான் தங்கும் இடம்; இதை நான் விரும்பினபடியால், இங்கே வாசம்பண்ணுவேன்.",
      verseReferenceTamil: "சங்கீதம் 132:14",
      description: [
        "God Rejoices in the Start: God celebrates the act of beginning and faithfulness in small tasks, not just the final result.",
        "Faithfulness in the Little: Being faithful in small duties leads to greater responsibility (Matthew 25:21).",
        "Transformative Power: Small beginnings hold potential for greatness, like a mustard seed growing into a large plant, or an acorn into an oak.",
        "God's hand helped to build a small tabernacle. With His divine grace, an evening service was started every Sunday, and a few believers gathered to worship the Lord."
      ],
      descriptionTamil: [
        "கர்த்தர் இறுதி முடிவை மட்டுமல்ல, சிறிய பணிகளின் தொடக்கத்தையும் உண்மையையும் கொண்டாடுகிறார், மகிழ்ச்சியடைகிறார்.",
        "சிறிய கடமைகளில் உண்மையாக இருப்பது, அதிக பொறுப்புக்கு வழிவகுக்கிறது (மத்தேயு 25:21).",
        "மாற்றும் சக்தி: சிறிய தொடக்கங்கள் மகத்துவத்திற்கான ஆற்றலைக் கொண்டுள்ளன (கடுகு விதை - பெரிய செடி).",
        "ஒரு சில குடும்பங்களுடன் ஒவ்வொரு ஞாயிற்றுக்கிழமை மாலை திருச்சபை வழிபாடு தொடங்கப்பட்டது."
      ]
    },
    {
      stageTitle: 'Stage - 3: Consecrated Forever (Year 2021)',
      stageTitleTamil: 'தோற்றம் - 3: என்றென்றும் பரிசுத்தமாக்கப்பட்டது (ஆண்டு 2021)',
      images: ['https://drive.google.com/thumbnail?id=15PfZzo_cndS-UmEWH09ApxtkA7B5c-1Q&sz=w2000',],
      verse: "For I have now chosen and consecrated this house, that my name may be there forever; and my eyes and my heart shall be there always.",
      verseReference: "2 Chronicles 7:16",
      verseTamil: "என் நாமம் இந்த ஆலயத்தில் என்றென்றைக்கும் இருக்கும்படி, நான் அதைத் தெரிந்துகொண்டு பரிசுத்தப்படுத்தினேன்; என் கண்களும் என் இருதயமும் எந்நாளும் இங்கே இருக்கும்.",
      verseReferenceTamil: "II நாளாகமம் 7:16",
      description: [
        "By the grace of the Lord, new church construction started, and new souls were added to the church."
      ],
      descriptionTamil: [
        "கர்த்தருடைய கிருபையால் புதிய தேவாலயக் கட்டமைப்பு தொடங்கியது, மேலும் புதிய ஆத்துமாக்கள் தேவாலயத்தில் சேர்க்கப்பட்டார்கள்."
      ]
    },
    {
      stageTitle: 'Year 2021',
      stageTitleTamil: 'ஆண்டு 2023',
      images: [
        'https://drive.google.com/thumbnail?id=1naj_EGGn-QqoJ7X3_a4YO2nxgshU0xcl&sz=w2000',
        'https://drive.google.com/thumbnail?id=1R7CXhdGoJw4ZZvXbGB17xCQEIky_NcHc&sz=w2000',
        'https://drive.google.com/thumbnail?id=188LCgT6Zy_IR-NM8oBCJFEyX0hR9ud1I&sz=w2000'
      ],
      verse: "",
      verseReference: "",
      verseTamil: "",
      verseReferenceTamil: "",
      description: [
      ],
      descriptionTamil: [
      ]
    },
    {
      stageTitle: 'Year 2023',
      stageTitleTamil: 'ஆண்டு 2023',
      images: [
        'https://drive.google.com/thumbnail?id=1M5dm_YGiLuyJYuCUFzC-W3pytEjXgL10&sz=w2000',
        'https://drive.google.com/thumbnail?id=1C2133LSQ_0ChpKy5qiL9tnpdagYULALe&sz=w2000',
        'https://drive.google.com/thumbnail?id=1qIfe9dbGpUTuzkzwhnhFugrlwDFRlbog&sz=w2000'
      ],
      verse: "what He spoke, He has done through His hands.",
      verseReference: "1 Kings 8:15",
      verseTamil: "அவர் தம்முடைய வாக்கினால் சொன்னதைத் தம்முடைய கரத்தினால் நிறைவேற்றினார்.",
      verseReferenceTamil: "I இராஜாக்கள் 8:15",
      description: [
        "These passages illustrate God's consistent action in making His spoken word a tangible reality, using His hands (representing power and action) and people to accomplish His purposes.",
        "God's faithfulness in bringing His spoken promises to pass through His actions. The phrase emphasizes that God's word is reliable and that He actively works to fulfil His purposes.",
        "Now St. Andrew's Church boasts a rich tradition of worship and prayer. It has a Choir, Sunday school, Youth fellowship, Young couple fellowship, Women's Fellowship and Men's Fellowship."
      ],
      descriptionTamil: [
        "தம்முடைய வார்த்தைகளை தம்முடைய செயல்கள் மூலம் நிறைவேற்றுவதில் கடவுளின் உண்மைத்தன்மை. இந்த சொற்றொடர் கடவுளின் வார்த்தை நம்பகமானது என்றும், அவர் தம்முடைய நோக்கங்களை நிறைவேற்ற தீவிரமாக செயல்படுகிறார் என்றும் வலியுறுத்துகிறது.",
        "தூய அந்திரேயா திருச்சபை வழிபாடு மற்றும் பிரார்த்தனையின் வளமான பாரம்பரியத்தைக் கொண்டுள்ளது. பாடகர் குழு, ஞாயிறு பள்ளி, வாலிபர் ஐக்கியம், இளம் தம்பதிகள் ஐக்கியம், பெண்கள் ஐக்கியம் மற்றும் ஆண்கள் ஐக்கியம் ஆகியவற்றைக் கொண்டுள்ளது.",
        "திருச்சபை வழியாக பல சமூக நலத்திட்டங்கள் செயல்படுத்தப்படுகின்றன."
      ]
    }
];
}