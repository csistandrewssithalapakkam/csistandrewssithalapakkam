import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { AdminUser, Role, PageAccess } from '../../shared/models/admin-user.model';

@Component({
  selector: 'app-user-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './user-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagerComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  viewMode = signal<'list' | 'form' | 'permissions'>('list');
  users = signal<AdminUser[]>([]);
  roles = signal<Role[]>([]);
  selectedUser = signal<AdminUser | null>(null);
  selectedRoleIds = signal<number[]>([]);
  isRoleDropdownOpen = signal(false);
  pageAccessList = signal<PageAccess[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  isEditing = computed(() => this.selectedUser() !== null && this.viewMode() === 'form');

  selectedRoleNames = computed(() => {
    const ids = this.selectedRoleIds();
    return this.roles()
      .filter(r => ids.includes(r.user_role_id))
      .map(r => r.user_role_name);
  });

  userForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    user_name: ['', Validators.required],
    user_email: ['', [Validators.required, Validators.email]],
    user_password: [''],
    mobile_number: [''],
    user_active: [1],
  });

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe(res => {
      if (res.success) this.users.set(res.data);
      this.isLoading.set(false);
      this.cdr.markForCheck();
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe(res => {
      if (res.success) this.roles.set(res.data);
      this.cdr.markForCheck();
    });
  }

  openCreateForm() {
    this.clearMessage();
    this.selectedUser.set(null);
    this.selectedRoleIds.set([]);
    this.isRoleDropdownOpen.set(false);
    this.userForm.reset({ user_active: 1 });
    this.userForm.controls.user_password.setValidators([Validators.required]);
    this.userForm.controls.user_password.updateValueAndValidity();
    this.viewMode.set('form');
  }

  openEditForm(user: AdminUser) {
    this.clearMessage();
    this.selectedUser.set(user);
    this.selectedRoleIds.set([]);
    this.isRoleDropdownOpen.set(false);
    this.userForm.reset();
    this.userForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      user_name: user.user_name,
      user_email: user.user_email,
      mobile_number: user.mobile_number ?? '',
      user_active: user.user_active,
    });
    this.userForm.controls.user_password.clearValidators();
    this.userForm.controls.user_password.updateValueAndValidity();
    this.viewMode.set('form');
    this.userService.getUserRoles(user.user_id).subscribe(res => {
      if (res.success) this.selectedRoleIds.set(res.data.map(r => r.user_role_id));
      this.cdr.markForCheck();
    });
  }

  openPermissions(user: AdminUser) {
    this.clearMessage();
    this.selectedUser.set(user);
    this.pageAccessList.set([]);
    this.isLoading.set(true);
    this.viewMode.set('permissions');
    this.userService.getUserPageAccess(user.user_id).subscribe(res => {
      if (res.success) this.pageAccessList.set(res.data);
      this.isLoading.set(false);
      this.cdr.markForCheck();
    });
  }

  toggleRole(roleId: number) {
    this.selectedRoleIds.update(ids =>
      ids.includes(roleId) ? ids.filter(id => id !== roleId) : [...ids, roleId]
    );
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.getRawValue();
    const payload: Record<string, unknown> = { ...formValue };
    if (!payload['user_password']) delete payload['user_password'];

    this.isSaving.set(true);
    const user = this.selectedUser();
    const op$ = user
      ? this.userService.updateUser(user.user_id, payload)
      : this.userService.createUser(payload);

    op$.subscribe(res => {
      if (res.success) {
        const userId: number | undefined = user?.user_id ?? (res as any).data?.user_id;
        const finish = () => {
          this.isSaving.set(false);
          this.viewMode.set('list');
          this.loadUsers();
          this.showMessage('success', user ? 'User updated successfully.' : 'User created successfully.');
          this.cdr.markForCheck();
        };
        if (userId !== undefined) {
          this.userService.assignUserRoles(userId, this.selectedRoleIds()).subscribe(finish);
        } else {
          finish();
        }
      } else {
        this.isSaving.set(false);
        this.showMessage('error', (res as any).message || 'Failed to save user.');
        this.cdr.markForCheck();
      }
    });
  }

  deactivateUser(user: AdminUser) {
    this.userService.deleteUser(user.user_id).subscribe(res => {
      if (res.success) {
        this.showMessage('success', `${user.first_name} ${user.last_name} deactivated.`);
        this.loadUsers();
      } else {
        this.showMessage('error', (res as any).message || 'Failed to deactivate user.');
      }
      this.cdr.markForCheck();
    });
  }

  toggleAccess(pageId: number, checked: boolean) {
    this.pageAccessList.update(list =>
      list.map(p =>
        p.page_id === pageId
          ? { ...p, has_access: checked, can_view: checked, can_create: checked && p.can_create, can_edit: checked && p.can_edit, can_delete: checked && p.can_delete }
          : p
      )
    );
  }

  togglePermission(pageId: number, perm: 'can_view' | 'can_create' | 'can_edit' | 'can_delete', checked: boolean) {
    this.pageAccessList.update(list =>
      list.map(p => p.page_id === pageId ? { ...p, [perm]: checked } : p)
    );
  }

  savePermissions() {
    const user = this.selectedUser();
    if (!user) return;

    const pages = this.pageAccessList()
      .filter(p => p.has_access)
      .map(p => ({
        page_id: p.page_id,
        can_view: p.can_view,
        can_create: p.can_create,
        can_edit: p.can_edit,
        can_delete: p.can_delete,
      }));

    this.isSaving.set(true);
    this.userService.assignPageAccess(user.user_id, pages).subscribe(res => {
      this.isSaving.set(false);
      if (res.success) {
        this.showMessage('success', 'Permissions saved successfully.');
      } else {
        this.showMessage('error', (res as any).message || 'Failed to save permissions.');
      }
      this.cdr.markForCheck();
    });
  }

  goBack() {
    this.isRoleDropdownOpen.set(false);
    this.viewMode.set('list');
  }

  private showMessage(type: 'success' | 'error', text: string) {
    this.message.set({ type, text });
    setTimeout(() => { this.message.set(null); this.cdr.markForCheck(); }, 4000);
  }

  private clearMessage() {
    this.message.set(null);
  }
}
