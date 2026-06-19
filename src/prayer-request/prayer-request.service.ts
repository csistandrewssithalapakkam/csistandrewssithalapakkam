import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

// Matches the API response structure
export interface ApiPrayerRequest {
  pr_id: number;
  pr_subject: string | null;
  pr_message: string;
  pr_submitted_by: string | null;
  pr_email: string | null;
  pr_mobile: string | null;
  pr_submitted_date: string; // ISO string
  pr_status: string;
  pr_remarks: string | null;
  created_date: string;
  created_by: string | null;
  updated_date: string;
  updated_by: string | null;
}

export interface PrayerRequest {
  id: number;
  request: string;
  submittedDate: Date;
  isActionTaken: boolean;
  actionTakenDate?: Date;
  email?: string;
  mobile?: string;
  remarks?: string | null;
}

interface PrayerRequestState {
  requests: PrayerRequest[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PrayerRequestService {
  // Fix: Explicitly type the injected HttpClient service.
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/prayer-request`;

  private state = signal<PrayerRequestState>({
    requests: [],
    loading: false,
    error: null,
  });

  prayerRequests = computed(() => this.state().requests);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  constructor() {
    // Initial load without filters
    this.loadRequests({});
  }

  loadRequests(filters: { from_date?: string | null; to_date?: string | null }) {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    let params = new HttpParams();
    if (filters.from_date) {
      params = params.set('from_date', filters.from_date);
    }
    if (filters.to_date) {
      params = params.set('to_date', filters.to_date);
    }

    this.http.get<ApiPrayerRequest[]>(this.apiUrl, { params }).pipe(
      // Fix: Explicitly type the parameter to resolve 'unknown' type error.
      map((apiRequests: ApiPrayerRequest[]) => apiRequests.map(this.mapToPrayerRequest)),
      catchError(error => {
        console.error('Failed to fetch prayer requests', error);
        this.state.update(s => ({ ...s, error: 'Could not load prayer requests.' }));
        return of([]);
      })
    ).subscribe(requests => {
      this.state.set({ requests, loading: false, error: this.state().error });
    });
  }

  updateRequestStatus(id: number, remarks: string): Promise<any> {
    const updateUrl = `${this.apiUrl}/status`;
    const body = {
      id,
      status: 'Completed',
      remarks: remarks || null,
    };
    return firstValueFrom(this.http.put(updateUrl, body));
  }

  // Mapper function to transform API data into the app's data model
  private mapToPrayerRequest(apiReq: ApiPrayerRequest): PrayerRequest {
    return {
      id: apiReq.pr_id,
      request: apiReq.pr_message,
      submittedDate: new Date(apiReq.pr_submitted_date),
      isActionTaken: apiReq.pr_status === 'Completed',
      actionTakenDate: apiReq.pr_status === 'Completed' ? new Date(apiReq.updated_date) : undefined,
      email: apiReq.pr_email || undefined,
      mobile: apiReq.pr_mobile || undefined,
      remarks: apiReq.pr_remarks,
    };
  }
}