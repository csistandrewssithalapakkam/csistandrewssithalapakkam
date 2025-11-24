import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}