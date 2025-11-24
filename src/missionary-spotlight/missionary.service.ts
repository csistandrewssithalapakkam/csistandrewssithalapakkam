import { Injectable, signal } from '@angular/core';

export interface MissionaryStory {
  id: number;
  title: string;
  imageUrl?: string;
  shortStory: string;
  detailedStory?: string;
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
      imageUrl: 'https://picsum.photos/400/400?grayscale&random=missionary',
      shortStory: 'An Indian Christian missionary who modeled his life on the sadhus (holy men) of his culture. Once a devout Sikh, Sundar Singh converted to Christianity and traveled extensively across the Indian subcontinent and Tibet, barefoot and in a saffron robe, sharing the message of Jesus. Renowned for his deep spiritual life and unwavering faith in the face of persecution, his legacy continues to inspire countless people around the world.',
      detailedStory: "Sadhu Sundar Singh's legacy is one of profound spiritual devotion and cultural contextualization of the Christian faith. He demonstrated that following Jesus did not require abandoning one's cultural identity. His approach as a 'sadhu'—an ascetic holy man—made the Christian message accessible and relatable within the Indian spiritual landscape.\n\nHis life was marked by incredible perseverance through hardship. He faced family rejection, imprisonment, and physical threats, yet he never wavered in his mission. His journeys into Tibet, a region notoriously difficult for missionaries, are legendary. These stories of faith and endurance have inspired generations of Christians to live boldly for their beliefs, regardless of the cost.\n\nFurthermore, Singh's emphasis on a direct, mystical experience with God resonated deeply with the spiritual traditions of India. His visions and parables, which he shared in his teachings and writings, continue to be studied and appreciated for their spiritual depth. He is remembered not just as a missionary, but as a mystic and a bridge-builder between Eastern and Western expressions of Christianity.",
      mappedMonth: 7, // August
    },
  ]);

  addStory(story: Omit<MissionaryStory, 'id'>) {
    const newStory: MissionaryStory = { ...story, id: this.nextId++ };
    this.stories.update(stories => [newStory, ...stories]);
  }
}
