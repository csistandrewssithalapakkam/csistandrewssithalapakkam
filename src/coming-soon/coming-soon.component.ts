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
  private clickCount = signal(0);
  
  isPasswordPromptVisible = signal(false);
  passwordAttempt = signal('');
  hasError = signal(false);

  // Signals for the launch flow
  passwordCorrect = signal(false);
  isLaunching = signal(false);
  isFinished = signal(false); // Controls when the component removes itself

  constructor() {
    // If already unlocked from session storage, hide this component immediately.
    if (this.bypassService.isUnlocked()) {
      this.isFinished.set(true);
    }
  }

  onTextClick() {
    this.clickCount.update(count => count + 1);

    if (this.clickCount() >= 3) {
      this.isPasswordPromptVisible.set(true);
      this.clickCount.set(0);
    }
  }

  closePrompt() {
    this.isPasswordPromptVisible.set(false);
    this.passwordAttempt.set('');
    this.hasError.set(false);
    this.clickCount.set(0);
  }

  submitPassword() {
    this.hasError.set(false);
    // Use checkPassword instead of unlock to verify credentials first
    if (this.bypassService.checkPassword(this.passwordAttempt())) {
      this.passwordCorrect.set(true);
      this.closePrompt();
    } else {
      this.hasError.set(true);
      this.passwordAttempt.set('');
    }
  }

  launchSite() {
    this.isLaunching.set(true);
    // Wait for all animations to complete before unlocking and hiding this component.
    // Total animation: 500ms content fade + 1000ms ribbon cut + 1000ms gate slide = 2500ms
    setTimeout(() => {
      this.bypassService.unlock('Welcome@987');
      this.isFinished.set(true);
    }, 2500); 
  }
}
