import { Injectable, signal, computed } from '@angular/core';

export interface Verse {
  quote: string;
  reference: string;
  quoteTamil: string;
  referenceTamil: string;
}

@Injectable({
  providedIn: 'root',
})
export class VerseService {
  private verses = signal<Verse[]>([
    {
      quote: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16",
      quoteTamil: "தேவன், தம்முடைய ஒரேபேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரைத் தந்தருளி, இவ்வளவாய் உலகத்தில் அன்புகூர்ந்தார்.",
      referenceTamil: "யோவான் 3:16"
    },
    {
      quote: "The Lord is my shepherd, I lack nothing.",
      reference: "Psalm 23:1",
      quoteTamil: "கர்த்தர் என் மேய்ப்பராயிருக்கிறார்; நான் தாழ்ச்சியடையேன்.",
      referenceTamil: "சங்கீதம் 23:1"
    },
    {
      quote: "I can do all this through him who gives me strength.",
      reference: "Philippians 4:13",
      quoteTamil: "என்னைப் பெலப்படுத்துகிற கிறிஸ்துவினாலே எல்லாவற்றையுஞ்செய்ய எனக்குப் பெலனுண்டு.",
      referenceTamil: "பிலிப்பியர் 4:13"
    },
    {
      quote: "Trust in the Lord with all your heart and lean not on your own understanding.",
      reference: "Proverbs 3:5",
      quoteTamil: "உன் சுயபுத்தியின்மேல் சாயாமல், உன் முழு இருதயத்தோடும் கர்த்தரில் நம்பிக்கையாயிரு.",
      referenceTamil: "நீதிமொழிகள் 3:5"
    },
    {
      quote: "Your word is a lamp for my feet, a light on my path.",
      reference: "Psalm 119:105",
      quoteTamil: "உம்முடைய வசனம் என் கால்களுக்குத் தீபமும், என் பாதைக்கு வெளிச்சமுமாயிருக்கிறது.",
      referenceTamil: "சங்கீதம் 119:105"
    }
  ]);

  dailyVerse = computed(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const verseIndex = dayOfYear % this.verses().length;
    return this.verses()[verseIndex];
  });
}