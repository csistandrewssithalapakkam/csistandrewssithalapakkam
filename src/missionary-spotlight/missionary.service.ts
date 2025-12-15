import { Injectable, signal } from '@angular/core';

export interface MissionaryStory {
  id: number;
  title: string;
  titleTamil?: string;
  imageUrl?: string;
  shortStory: string;
  shortStoryTamil?: string;
  detailedStory?: string;
  detailedStoryTamil?: string;
  mappedMonth?: number; // 0-11 for Jan-Dec
}

@Injectable({
  providedIn: 'root',
})
export class MissionaryService {
  private nextId = 2;
  stories = signal<MissionaryStory[]>([
    {
      id: 1,
      title: 'Sadhu Sundar Singh (1889 - c. 1929)',
      titleTamil: 'சாது சுந்தர் சிங் (1889 - c. 1929)',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/02/SadhuSundarSingh.jpg',
      shortStory: 'Sadhu Sundar Singh was an Indian Christian missionary who, after a dramatic conversion from his Sikh faith, adopted the life of an ascetic to spread the Gospel. He traveled barefoot across India and the treacherous Himalayas, facing immense hardship and persecution. His life of deep prayer and unwavering faith continues to inspire people worldwide.',
      shortStoryTamil: 'சாது சுந்தர் சிங் ஒரு இந்திய கிறிஸ்தவ மிஷனரி ஆவார், அவர் தனது சீக்கிய மதத்திலிருந்து வியத்தகு மாற்றத்திற்குப் பிறகு, நற்செய்தியைப் பரப்புவதற்காக ஒரு துறவியின் வாழ்க்கையை ஏற்றுக்கொண்டார். அவர் இந்தியா மற்றும் துரோகமான இமயமலை முழுவதும் வெறுங்காலுடன் பயணம் செய்தார், பெரும் கஷ்டங்களையும் துன்புறுத்தல்களையும் எதிர்கொண்டார். ஆழ்ந்த ஜெபம் மற்றும் அசைக்க முடியாத விசுவாசத்தின் அவரது வாழ்க்கை உலகெங்கிலும் உள்ள மக்களுக்கு தொடர்ந்து ஊக்கமளிக்கிறது.',
      detailedStory: 'Sadhu Sundar Singh, an Indian Christian missionary, lived a life that was a testament to his unwavering faith in Jesus Christ, even in the face of immense persecution.\n\nBorn into a Sikh family, Sundar\'s spiritual quest led him to a dramatic encounter with Jesus, which transformed his life forever. Forsaking his affluent background, he adopted the traditional Indian ascetic (Sadhu) lifestyle, traveling barefoot across India and Tibet, often facing extreme weather and hostility.\n\nSundar\'s ministry was marked by deep prayer, miraculous provisions, and a passionate desire to share the Gospel, especially in the treacherous Himalayas. Despite being disowned by his family and facing constant danger, his message of God\'s love and his Christ-like life left an indelible mark on all who met him.\n\nHis mysterious disappearance in the Himalayas remains a subject of intrigue, but his legacy as a devoted follower of Christ continues to inspire countless individuals worldwide.',
      detailedStoryTamil: 'சாது சுந்தர் சிங் ஒரு இந்திய கிறிஸ்தவ மிஷனரி ஆவார், அவருடைய வாழ்க்கை, பெரும் துன்புறுத்தல்களுக்கு மத்தியிலும் இயேசு கிறிஸ்துவின் மீதான அவரது அசைக்க முடியாத விசுவாசத்திற்கு ஒரு சான்றாக இருந்தது.\n\nஒரு சீக்கிய குடும்பத்தில் பிறந்த சுந்தரின் ஆன்மீகத் தேடல், அவரை இயேசுவுடன் ஒரு வியத்தகு சந்திப்பிற்கு அழைத்துச் சென்றது, அது அவருடைய வாழ்க்கையை என்றென்றும் மாற்றியது. தனது வசதியான பின்னணியைத் துறந்து, அவர் பாரம்பரிய இந்திய துறவி (சாது) வாழ்க்கை முறையை ஏற்றுக்கொண்டார், இந்தியா மற்றும் திபெத் முழுவதும் வெறுங்காலுடன் பயணம் செய்தார், பெரும்பாலும் தீவிர வானிலை மற்றும் விரோதப் போக்கை எதிர்கொண்டார்.\n\nசுந்தரின் ஊழியம் ஆழ்ந்த ஜெபம், அற்புத ஏற்பாடுகள் மற்றும் நற்செய்தியைப் பகிர்ந்து கொள்வதற்கான ஆழ்ந்த விருப்பம், குறிப்பாக துரோகமான இமயமலையில் ஆகியவற்றால் குறிக்கப்பட்டது. அவரது குடும்பத்தினரால் நிராகரிக்கப்பட்ட போதிலும், நிலையான ஆபத்தை எதிர்கொண்ட போதிலும், கடவுளின் அன்பு பற்றிய அவரது செய்தி மற்றும் அவரது கிறிஸ்துவைப் போன்ற வாழ்க்கை அவரைச் சந்தித்த அனைவர் மீதும் ஒரு அழியாத முத்திரையைப் பதித்தது.\n\nஇமயமலையில் அவர் மர்மமான முறையில் காணாமல் போனது ஒரு புதிராகவே உள்ளது, ஆனால் கிறிஸ்துவின் ஒரு அர்ப்பணிப்புள்ள சீடராக அவரது மரபு உலகெங்கிலும் உள்ள எண்ணற்ற நபர்களுக்கு தொடர்ந்து ஊக்கமளிக்கிறது.',
      mappedMonth: 7, // August
    },
  ]);

  addStory(storyData: Omit<MissionaryStory, 'id'>) {
    const newStory: MissionaryStory = {
      ...storyData,
      id: this.nextId++,
    };
    this.stories.update(stories => [newStory, ...stories]);
  }
}