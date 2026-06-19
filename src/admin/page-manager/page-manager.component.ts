import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user-manager/user.service';
import { Page } from '../../shared/models/admin-user.model';

@Component({
  selector: 'app-page-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './page-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageManagerComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  viewMode = signal<'list' | 'form'>('list');
  pages = signal<Page[]>([]);
  flatPages = signal<Page[]>([]);
  selectedPage = signal<Page | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  isEditing = computed(() => this.selectedPage() !== null);

  topLevelPages = computed(() => this.flatPages().filter(p => !p.parent_id));

  pageForm = this.fb.group({
    page_name: ['', Validators.required],
    page_slug: ['', Validators.required],
    page_icon: [''],
    parent_id: [null as number | null],
    sort_order: [0],
  });

  ngOnInit() {
    this.loadPages();
  }

  loadPages() {
    this.isLoading.set(true);
    this.userService.getPages().subscribe(res => {
      if (res.success) this.pages.set(res.data);
      this.isLoading.set(false);
      this.cdr.markForCheck();
    });
    this.userService.getAllPages().subscribe(res => {
      if (res.success) this.flatPages.set(res.data);
      this.cdr.markForCheck();
    });
  }

  openCreateForm(parentPage?: Page) {
    this.clearMessage();
    this.selectedPage.set(null);
    this.pageForm.reset({ sort_order: 0, parent_id: parentPage?.page_id ?? null });
    this.viewMode.set('form');
  }

  openEditForm(page: Page) {
    this.clearMessage();
    this.selectedPage.set(page);
    this.pageForm.reset();
    this.pageForm.patchValue({
      page_name: page.page_name,
      page_slug: page.page_slug,
      page_icon: page.page_icon ?? '',
      parent_id: page.parent_id ?? null,
      sort_order: page.sort_order ?? 0,
    });
    this.viewMode.set('form');
  }

  savePage() {
    if (this.pageForm.invalid) {
      this.pageForm.markAllAsTouched();
      return;
    }
    const formValue = this.pageForm.getRawValue();
    const payload: Partial<Page> = {
      page_name: formValue.page_name!,
      page_slug: formValue.page_slug!,
      page_icon: formValue.page_icon || undefined,
      parent_id: formValue.parent_id,
      sort_order: formValue.sort_order ?? 0,
    };

    this.isSaving.set(true);
    const page = this.selectedPage();
    const op$ = page
      ? this.userService.updatePage(page.page_id, payload)
      : this.userService.createPage(payload);

    op$.subscribe(res => {
      this.isSaving.set(false);
      if (res.success) {
        this.viewMode.set('list');
        this.loadPages();
        this.showMessage('success', page ? 'Page updated successfully.' : 'Page created successfully.');
      } else {
        this.showMessage('error', res.message || 'Failed to save page.');
      }
      this.cdr.markForCheck();
    });
  }

  deletePage(page: Page) {
    this.userService.deletePage(page.page_id).subscribe(res => {
      if (res.success) {
        this.showMessage('success', `"${page.page_name}" deactivated.`);
        this.loadPages();
      } else {
        this.showMessage('error', res.message || 'Failed to deactivate page.');
      }
      this.cdr.markForCheck();
    });
  }

  goBack() {
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
