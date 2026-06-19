import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-prayer-request',
  imports: [],
  templateUrl: './prayer-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerRequestComponent {
  // Fix: Explicitly type the injected HttpClient service.
  private http: HttpClient = inject(HttpClient);
  prayerRequest = signal('');
  email = signal('');
  mobile = signal('');
  isDarkMode = signal(false);
  isSubmitting = signal(false);
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');
  hasValidationError = signal(false);

  onPrayerRequestFocus() {
    // When the user focuses on the input, remove the validation error state.
    if (this.hasValidationError()) {
      this.hasValidationError.set(false);
    }
  }

  onPrayerRequestInput(value: string) {
    this.prayerRequest.set(value);
    // As soon as the user starts typing, remove the validation error state.
    if (this.hasValidationError()) {
      this.hasValidationError.set(false);
    }
  }

  submitPrayerRequest() {
    if (!this.prayerRequest().trim()) {
      this.hasValidationError.set(true);
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.hasValidationError.set(false);
    this.isSubmitting.set(true);

    const apiUrl = `${environment.apiBaseUrl}/prayer-request`;
    const body = {
      Request: this.prayerRequest(),
      Email: this.email(),
      MobileNumber: this.mobile(),
    };

    this.http
      .post(apiUrl, body)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.toastMessage.set(
            'Your prayer request has been submitted. We will be praying for you.'
          );
          this.toastType.set('success');
          setTimeout(() => this.toastMessage.set(null), 3000);

          this.prayerRequest.set('');
          this.email.set('');
          this.mobile.set('');
        },
        error: (err) => {
          console.error('Prayer request submission failed:', err);
          this.toastMessage.set('Submission failed. Please try again later.');
          this.toastType.set('error');
          setTimeout(() => this.toastMessage.set(null), 4000);
        },
      });
  }

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
  }
}
