import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { BypassService } from '../bypass.service';

@Component({
  selector: 'app-coming-soon',
  imports: [],
  templateUrl: './coming-soon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent {
  bypassService = inject(BypassService);
  
  // Signal for the launch flow
  isLaunching = signal(false);

  // Signals for the password flow
  clickCount = signal(0);
  isPasswordPromptVisible = signal(false);
  passwordAttempt = signal('');
  passwordCorrect = signal(false);
  hasError = signal(false);
  
  private readonly CORRECT_PASSWORD = 'WelcomeTo123';
  private readonly CLICKS_TO_PROMPT = 3;

  onTextClick(): void {
    this.clickCount.update(c => c + 1);
    if (this.clickCount() >= this.CLICKS_TO_PROMPT) {
      this.isPasswordPromptVisible.set(true);
      this.clickCount.set(0); // Reset for next time
    }
  }

  closePrompt(): void {
    this.isPasswordPromptVisible.set(false);
    this.passwordAttempt.set('');
    this.hasError.set(false);
  }

  submitPassword(): void {
    if (this.passwordAttempt() === this.CORRECT_PASSWORD) {
      this.passwordCorrect.set(true);
      this.closePrompt();
    } else {
      this.hasError.set(true);
      this.passwordAttempt.set('');
    }
  }

  launchSite() {
    if (this.isLaunching()) {
      return; // Prevent multiple clicks
    }
    this.isLaunching.set(true);

    // Call API to update ribbon status first
    this.bypassService.updateRibbonStatus()
      .then(() => {
        // API call successful, proceed with animations and unlocking.
        // The parent component will destroy this one when isUnlocked becomes true.
        // Total animation: 500ms content fade + 1000ms ribbon cut + 1000ms gate slide = 2500ms
        setTimeout(() => {
          this.bypassService.isUnlocked.set(true);
        }, 2500);
      })
      .catch(error => {
        // If API call fails, stop the launch animation and log the error.
        console.error('Failed to update ribbon. Site will not launch.', error);
        this.isLaunching.set(false);
        // Optionally, show an error message to the user here.
      });
  }
}