import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FellowshipPost } from '../../fellowship-groups/fellowship.service';

@Component({
  selector: 'app-fellowship-post-preview',
  standalone: true,
  templateUrl: './fellowship-post-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FellowshipPostPreviewComponent {
  post = input.required<FellowshipPost>();
}
