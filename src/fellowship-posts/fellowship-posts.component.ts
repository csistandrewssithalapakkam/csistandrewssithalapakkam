import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FellowshipService, FellowshipGroup } from '../fellowship-groups/fellowship.service';
import { FellowshipPostPreviewComponent } from '../shared/fellowship-post-preview/fellowship-post-preview.component';

@Component({
  selector: 'app-fellowship-posts',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, DatePipe, FellowshipPostPreviewComponent],
  templateUrl: './fellowship-posts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FellowshipPostsComponent {
  private route = inject(ActivatedRoute);
  private fellowshipService = inject(FellowshipService);

  fellowshipName = toSignal(
    this.route.params.pipe(map(params => params['name'] || '')),
    { initialValue: '' }
  );
  
  fellowship = computed<FellowshipGroup | undefined>(() => 
    this.fellowshipService.fellowshipGroups().find(f => f.name === this.fellowshipName())
  );
  
  posts = computed(() => this.fellowshipService.posts());

  constructor() {
    effect(() => {
      const name = this.fellowshipName();
      if (name) {
        this.fellowshipService.loadPosts(name);
      }
    });
  }
}



