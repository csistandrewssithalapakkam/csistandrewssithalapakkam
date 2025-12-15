import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { WelcomeMessageComponent } from '../welcome-message/welcome-message.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { FellowshipGroupsComponent } from '../fellowship-groups/fellowship-groups.component';
import { MilestonesComponent } from '../milestones/milestones.component';
import { EventsComponent } from '../events/events.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { MissionarySpotlightComponent } from '../missionary-spotlight/missionary-spotlight.component';
import { PrayerRequestComponent } from '../prayer-request/prayer-request.component';
import { VisitUsComponent } from '../visit-us/visit-us.component';
import { FooterComponent } from '../footer/footer.component';
import { OurServicesComponent } from '../our-services/our-services.component';
import { SocialServicesComponent } from '../social-services/social-services.component';
import { DailyVerseComponent } from '../daily-verse/daily-verse.component';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    HeroComponent,
    DailyVerseComponent,
    WelcomeMessageComponent,
    AboutUsComponent,
    OurServicesComponent,
    SocialServicesComponent,
    FellowshipGroupsComponent,
    MilestonesComponent,
    EventsComponent,
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