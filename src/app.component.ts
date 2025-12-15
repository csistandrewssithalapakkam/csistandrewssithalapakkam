import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { BypassService } from './bypass.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ComingSoonComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private bypassService = inject(BypassService);
  isUnlocked = this.bypassService.isUnlocked;
}