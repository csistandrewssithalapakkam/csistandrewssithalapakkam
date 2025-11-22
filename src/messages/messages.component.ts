import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [NgOptimizedImage],
  templateUrl: './messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {
  recentMessages = [
    {
      image: 'https://picsum.photos/600/400?random=7',
      title: 'The Power of Forgiveness',
      author: 'Pastor John Doe',
    },
    {
      image: 'https://picsum.photos/600/400?random=8',
      title: 'Living with Purpose',
      author: 'Guest Speaker Jane Smith',
    },
    {
      image: 'https://picsum.photos/600/400?random=9',
      title: 'Finding Peace in Chaos',
      author: 'Pastor John Doe',
    },
  ];
}
