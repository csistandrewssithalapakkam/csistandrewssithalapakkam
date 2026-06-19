import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminUser, Page, PageAccess, PageAccessAssignment, Role } from '../../shared/models/admin-user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/admin`;

  getUsers() {
    return this.http.get<{ success: boolean; data: AdminUser[] }>(`${this.baseUrl}/users`).pipe(
      catchError(() => of({ success: false, data: [] as AdminUser[] }))
    );
  }

  createUser(data: Partial<AdminUser> & { user_password?: string }) {
    return this.http.post<{ success: boolean; message?: string }>(`${this.baseUrl}/users`, data).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  updateUser(id: number, data: Partial<AdminUser> & { user_password?: string }) {
    return this.http.put<{ success: boolean; message?: string }>(`${this.baseUrl}/users/${id}`, data).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  deleteUser(id: number) {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  getPages() {
    return this.http.get<{ success: boolean; data: Page[] }>(`${this.baseUrl}/pages`).pipe(
      catchError(() => of({ success: false, data: [] as Page[] }))
    );
  }

  getAllPages() {
    return this.http.get<{ success: boolean; data: Page[] }>(`${this.baseUrl}/pages/all`).pipe(
      catchError(() => of({ success: false, data: [] as Page[] }))
    );
  }

  createPage(data: Partial<Page>) {
    return this.http.post<{ success: boolean; message?: string }>(`${this.baseUrl}/pages`, data).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  updatePage(id: number, data: Partial<Page>) {
    return this.http.put<{ success: boolean; message?: string }>(`${this.baseUrl}/pages/${id}`, data).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  deletePage(id: number) {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.baseUrl}/pages/${id}`).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  getUserPageAccess(userId: number) {
    return this.http.get<{ success: boolean; data: PageAccess[] }>(`${this.baseUrl}/users/${userId}/page-access`).pipe(
      catchError(() => of({ success: false, data: [] as PageAccess[] }))
    );
  }

  assignPageAccess(userId: number, pages: PageAccessAssignment[]) {
    return this.http.post<{ success: boolean; message?: string }>(`${this.baseUrl}/users/${userId}/page-access`, { pages }).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  getRoles() {
    return this.http.get<{ success: boolean; data: Role[] }>(`${this.baseUrl}/roles`).pipe(
      catchError(() => of({ success: false, data: [] as Role[] }))
    );
  }

  getUserRoles(userId: number) {
    return this.http.get<{ success: boolean; data: Role[] }>(`${this.baseUrl}/users/${userId}/roles`).pipe(
      catchError(() => of({ success: false, data: [] as Role[] }))
    );
  }

  assignUserRoles(userId: number, roleIds: number[]) {
    return this.http.post<{ success: boolean; message?: string }>(`${this.baseUrl}/users/${userId}/roles`, { role_ids: roleIds }).pipe(
      catchError(() => of({ success: false, message: 'Request failed' }))
    );
  }

  getMyPageAccess() {
    return this.http.get<{ success: boolean; data: PageAccess[] }>(`${this.baseUrl}/my-page-access`).pipe(
      catchError(() => of({ success: false, data: [] as PageAccess[] }))
    );
  }
}
