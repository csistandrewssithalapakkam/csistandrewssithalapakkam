import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FellowshipService } from './fellowship.service';

@Component({
  selector: 'app-fellowship-groups',
  imports: [RouterLink],
  templateUrl: './fellowship-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FellowshipGroupsComponent {
  private fellowshipService = inject(FellowshipService);
  fellowshipGroups = this.fellowshipService.fellowshipGroups;
}
