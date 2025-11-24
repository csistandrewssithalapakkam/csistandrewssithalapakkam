import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { PrayerRequestService } from './prayer-request.service';

@Component({
  selector: 'app-prayer-request',
  imports: [],
  templateUrl: './prayer-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerRequestComponent {
  private prayerRequestService = inject(PrayerRequestService);
  prayerRequest = signal('');
  isDarkMode = signal(false);

  submitPrayerRequest() {
    if (this.prayerRequest().trim()) {
      this.prayerRequestService.addRequest(this.prayerRequest());
      alert(
        'Your prayer request has been submitted. We will be praying for you.'
      );
      this.prayerRequest.set('');
    }
  }

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
  }
}
