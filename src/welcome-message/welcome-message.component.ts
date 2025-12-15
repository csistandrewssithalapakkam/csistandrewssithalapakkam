import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-welcome-message',
  imports: [],
  templateUrl: './welcome-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeMessageComponent {
  currentLanguage = signal<'english' | 'tamil'>('english');
  pastorName = "Rev. N. Abinath Selvakumar";
  pastorNameTamil = "Rev. N. அபினாத் செல்வகுமார்";
  pastorTitle = "Presbyter Incharge";
  pastorTitleTamil = "குருவானவர்";

  setLanguage(lang: 'english' | 'tamil') {
    this.currentLanguage.set(lang);
  }
}