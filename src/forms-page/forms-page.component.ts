import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsService } from './forms.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-forms-page',
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './forms-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsPageComponent {
  private formsService = inject(FormsService);
  forms = this.formsService.forms;
}