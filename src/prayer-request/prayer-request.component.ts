import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-prayer-request',
  templateUrl: './prayer-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerRequestComponent {
  prayerRequest = signal('');
  isDarkMode = signal(false);

  submitPrayerRequest() {
    if (this.prayerRequest().trim()) {
      console.log('Prayer request submitted:', this.prayerRequest());
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