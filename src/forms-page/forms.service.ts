import { Injectable, signal } from '@angular/core';

export interface DownloadableForm {
  title: string;
  description: string;
  downloadUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  forms = signal<DownloadableForm[]>([
    {
      title: 'New Member Request Form',
      description: 'Please fill out this form if you wish to become a registered member of St. Andrew\'s Church.',
      downloadUrl: '#', // Placeholder URL
    },
    {
      title: 'Marriage Application & Prerequisites',
      description: 'Information and application form for couples wishing to be married at our church. Please review the prerequisites carefully.',
      downloadUrl: '#', // Placeholder URL
    },
    {
      title: 'Baptism Application Form',
      description: 'Application form for scheduling a baptism service for an infant or adult.',
      downloadUrl: '#', // Placeholder URL
    },
  ]);
}