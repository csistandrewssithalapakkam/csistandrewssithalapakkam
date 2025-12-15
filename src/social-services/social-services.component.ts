import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-social-services',
  imports: [],
  templateUrl: './social-services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialServicesComponent {
  socialServices = [
    {
      title: 'Community Support',
      description: 'Providing support and resources to local families and individuals in need through various outreach programs.',
      icon: 'users'
    },
    {
      title: 'Educational Programs',
      description: 'Offering tutoring and mentorship programs for children and youth in our community to help them succeed academically.',
      icon: 'academic-cap'
    },
    {
      title: 'Health & Wellness',
      description: 'Organizing health camps and awareness programs to promote well-being within Sithalapakkam and surrounding areas.',
      icon: 'heart'
    }
  ];
}
