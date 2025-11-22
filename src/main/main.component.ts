import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { DailyVerseComponent } from '../daily-verse/daily-verse.component';
import { MilestonesComponent } from '../milestones/milestones.component';
import { EventsComponent } from '../events/events.component';
import { MessagesComponent } from '../messages/messages.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { MissionarySpotlightComponent } from '../missionary-spotlight/missionary-spotlight.component';
import { PrayerRequestComponent } from '../prayer-request/prayer-request.component';
import { VisitUsComponent } from '../visit-us/visit-us.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    HeroComponent,
    DailyVerseComponent,
    MilestonesComponent,
    EventsComponent,
    MessagesComponent,
    GalleryComponent,
    MissionarySpotlightComponent,
    PrayerRequestComponent,
    VisitUsComponent,
    FooterComponent,
  ],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
