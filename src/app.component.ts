import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BypassService } from './bypass.service';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ComingSoonComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  bypassService = inject(BypassService);
}
