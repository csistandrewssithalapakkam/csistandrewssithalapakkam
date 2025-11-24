import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { BypassService } from '../bypass.service';

@Component({
  selector: 'app-coming-soon',
  imports: [],
  templateUrl: './coming-soon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent {
  private bypassService = inject(BypassService);
  private clickCount = signal(0);
  isPasswordPromptVisible = signal(false);
  passwordAttempt = signal('');
  hasError = signal(false);

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
    if (!this.bypassService.unlock(this.passwordAttempt())) {
      this.hasError.set(true);
      this.passwordAttempt.set('');
    }
    // On success, the parent component will remove this component from the DOM.
  }
}
