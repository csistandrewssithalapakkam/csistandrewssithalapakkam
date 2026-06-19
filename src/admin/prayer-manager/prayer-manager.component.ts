import { PermissionService } from '../permission.service';
import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PrayerRequestService, PrayerRequest } from '../../prayer-request/prayer-request.service';

@Component({
  selector: 'app-prayer-manager',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './prayer-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerManagerComponent implements OnInit {
  protected permissionService = inject(PermissionService);
  private fb: FormBuilder = inject(FormBuilder);
  prayerRequestService = inject(PrayerRequestService);

  viewMode = signal<'active' | 'archived'>('active');
  isRemarksModalVisible = signal(false);
  selectedRequestForRemarks = signal<PrayerRequest | null>(null);
  isSubmittingRemarks = signal(false);

  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');
  
  filterForm = this.fb.group({
      month: [''],
      startDate: [''],
      endDate: [''],
  });

  remarksForm = this.fb.group({
    remarks: ['']
  });

  ngOnInit() {
    this.filterForm.valueChanges.subscribe(values => {
      this.prayerRequestService.loadRequests({
        from_date: values.startDate,
        to_date: values.endDate,
      });
    });
  }

  activeRequests = computed(() => {
    const allActive = this.prayerRequestService.prayerRequests().filter(r => !r.isActionTaken);
    // Filtering by month is now client-side after data is fetched by date range
    const { month } = this.filterForm.value;
    
    let filtered = allActive;

    if (month) {
        const monthNum = parseInt(month, 10);
        // Active requests use submittedDate for month filtering
        filtered = filtered.filter(r => r.submittedDate && r.submittedDate.getMonth() === monthNum);
    }
    
    // Sort active requests by most recent first
    return filtered.sort((a, b) => b.submittedDate.getTime() - a.submittedDate.getTime());
  });

  archivedRequests = computed(() => {
    const allArchived = this.prayerRequestService.prayerRequests().filter(r => r.isActionTaken);
    // Filtering by month is now client-side after data is fetched by date range
    const { month } = this.filterForm.value;
    
    let filtered = allArchived;

    if (month) {
        const monthNum = parseInt(month, 10);
        filtered = filtered.filter(r => r.actionTakenDate && r.actionTakenDate.getMonth() === monthNum);
    }
    
    return filtered.sort((a, b) => (b.actionTakenDate?.getTime() ?? 0) - (a.actionTakenDate?.getTime() ?? 0));
  });

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  openRemarksModal(request: PrayerRequest) {
    this.selectedRequestForRemarks.set(request);
    this.remarksForm.reset();
    this.isRemarksModalVisible.set(true);
  }

  closeRemarksModal() {
    this.isRemarksModalVisible.set(false);
    this.selectedRequestForRemarks.set(null);
  }

  submitRemarks() {
    if (this.isSubmittingRemarks() || !this.selectedRequestForRemarks()) {
      return;
    }
    this.isSubmittingRemarks.set(true);
    const id = this.selectedRequestForRemarks()!.id;
    const remarks = this.remarksForm.value.remarks || '';

    this.prayerRequestService.updateRequestStatus(id, remarks)
      .then(() => {
        this.showToast('Prayer request updated successfully.', 'success');
        this.closeRemarksModal();
        this.prayerRequestService.loadRequests({
          from_date: this.filterForm.value.startDate,
          to_date: this.filterForm.value.endDate,
        });
      })
      .catch(err => {
        console.error('Failed to update status:', err);
        this.showToast('Failed to update. Please try again.', 'error');
      })
      .finally(() => {
        this.isSubmittingRemarks.set(false);
      });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }

  clearFilters() {
      this.filterForm.reset({ month: '', startDate: '', endDate: '' });
  }
}