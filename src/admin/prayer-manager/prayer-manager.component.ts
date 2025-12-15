import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PrayerRequestService, PrayerRequest } from '../../prayer-request/prayer-request.service';

@Component({
  selector: 'app-prayer-manager',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './prayer-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerManagerComponent {
  private fb: FormBuilder = inject(FormBuilder);
  prayerRequestService = inject(PrayerRequestService);

  viewMode = signal<'active' | 'archived'>('active');
  
  filterForm = this.fb.group({
      month: [''],
      startDate: [''],
      endDate: [''],
  });

  activeRequests = computed(() => 
    this.prayerRequestService.prayerRequests().filter(r => !r.isActionTaken)
  );

  archivedRequests = computed(() => {
    const allArchived = this.prayerRequestService.prayerRequests().filter(r => r.isActionTaken);
    const { month, startDate, endDate } = this.filterForm.value;
    
    let filtered = allArchived;

    if (month) {
        const monthNum = parseInt(month, 10);
        filtered = filtered.filter(r => r.actionTakenDate && r.actionTakenDate.getMonth() === monthNum);
    }

    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filtered = filtered.filter(r => r.actionTakenDate && r.actionTakenDate >= start);
    }
    
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter(r => r.actionTakenDate && r.actionTakenDate <= end);
    }

    return filtered.sort((a, b) => (b.actionTakenDate?.getTime() ?? 0) - (a.actionTakenDate?.getTime() ?? 0));
  });

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  markActionTaken(id: number) {
    this.prayerRequestService.markActionTaken(id);
  }

  clearFilters() {
      this.filterForm.reset({ month: '', startDate: '', endDate: '' });
  }
}