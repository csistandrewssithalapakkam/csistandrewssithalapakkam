import { Injectable, signal } from '@angular/core';

export interface PrayerRequest {
  id: number;
  request: string;
  submittedDate: Date;
  isActionTaken: boolean;
  actionTakenDate?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PrayerRequestService {
  private nextId = 1;
  prayerRequests = signal<PrayerRequest[]>([
    { id: 0, request: 'Please pray for my family\'s health and safety during our travels next week.', submittedDate: new Date(Date.now() - 86400000 * 2), isActionTaken: false },
    { id: 1, request: 'Prayer for a successful job interview on Friday morning.', submittedDate: new Date(), isActionTaken: false },
  ]);

  addRequest(requestText: string) {
    if (!requestText.trim()) return;
    const newRequest: PrayerRequest = {
      id: this.nextId++,
      request: requestText,
      submittedDate: new Date(),
      isActionTaken: false,
    };
    this.prayerRequests.update(requests => [newRequest, ...requests]);
  }

  markActionTaken(id: number) {
    this.prayerRequests.update(requests =>
      requests.map(req =>
        req.id === id
          ? { ...req, isActionTaken: true, actionTakenDate: new Date() }
          : req
      )
    );
  }
}
