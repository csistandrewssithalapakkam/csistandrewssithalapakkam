import { PermissionService } from '../permission.service';
import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FellowshipService, FellowshipPost } from '../../fellowship-groups/fellowship.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { FellowshipPostPreviewComponent } from '../../shared/fellowship-post-preview/fellowship-post-preview.component';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-fellowship-manager',
  imports: [
    ReactiveFormsModule, 
    DatePipe, 
    ConfirmationModalComponent, 
    FellowshipPostPreviewComponent,
    QuillModule
  ],
  templateUrl: './fellowship-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FellowshipManagerComponent {
  protected permissionService = inject(PermissionService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  fellowshipService = inject(FellowshipService);

  // Convert route params to a signal, normalising the name to the canonical group name.
  // The backend may store page_name with a plain apostrophe while the frontend groups
  // use a Unicode right-single-quotation-mark (e.g. "Men\u2019s Fellowship").
  // Always resolve to the canonical frontend name so loadPosts uses the same string
  // that was used when posts were originally saved.
  fellowshipName = toSignal(
    this.route.params.pipe(
      map(params => {
        const raw = params['name'] || '';
        const normalise = (s: string) =>
          s.replace(/[\u2018\u2019\u02BC']/g, "'").toLowerCase().trim();
        const canonical = this.fellowshipService.fellowshipGroups()
          .find(g => normalise(g.name) === normalise(raw));
        return canonical ? canonical.name : raw;
      })
    ),
    { initialValue: '' }
  );

  isSaving = signal(false);

  // Modal states
  isModalVisible = signal(false);
  isPreviewModalVisible = signal(false);
  isConfirmModalVisible = signal(false);
  
  editingPost = signal<FellowshipPost | null>(null);
  previewPost = signal<FellowshipPost | null>(null);
  postForm: FormGroup;

  confirmAction = signal<{ postId: number } | null>(null);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    // This effect reads fellowshipName() signal, so it re-runs whenever the route param changes
    effect(() => {
      const name = this.fellowshipName();
      if (name) {
        this.fellowshipService.loadPosts(name);
      }
    });
  }

  // Posts come directly from the service signal
  get posts() {
    return this.fellowshipService.posts;
  }

  openModal(post: FellowshipPost | null = null) {
    this.editingPost.set(post);
    this.postForm.reset({ title: '', content: '' });

    if (post) {
      this.postForm.patchValue({ 
        title: post.title,
        content: post.content
      });
    }
    this.isModalVisible.set(true);
  }

  closeModal() {
    this.isModalVisible.set(false);
  }

  openPreview() {
    this.postForm.markAllAsTouched();
    if (this.postForm.invalid) return;

    const formValue = this.postForm.getRawValue();
    const constructedPost: FellowshipPost = {
      id: this.editingPost()?.id || 0,
      fellowshipName: this.fellowshipName(),
      title: formValue.title,
      content: formValue.content,
      date: new Date(),
    };

    this.previewPost.set(constructedPost);
    this.isPreviewModalVisible.set(true);
  }

  closePreview() {
    this.isPreviewModalVisible.set(false);
  }

  savePost() {
    const postToSave = this.previewPost();
    if (!postToSave) return;

    this.isSaving.set(true);
    const payload = {
      fellowshipName: postToSave.fellowshipName,
      title: postToSave.title,
      content: postToSave.content
    };

    if (this.editingPost()) {
      // Update existing post
      this.fellowshipService.updatePost(postToSave.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closePreview();
          this.closeModal();
          this.fellowshipService.loadPosts(this.fellowshipName());
        },
        error: (err) => {
          console.error('Error updating post:', err);
          this.isSaving.set(false);
          alert('Failed to update post. Please try again.');
        }
      });
    } else {
      // Create new post
      this.fellowshipService.createPost(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closePreview();
          this.closeModal();
          this.fellowshipService.loadPosts(this.fellowshipName());
        },
        error: (err) => {
          console.error('Error creating post:', err);
          this.isSaving.set(false);
          alert('Failed to create post. Please try again.');
        }
      });
    }
  }

  deletePost(id: number) {
    this.confirmAction.set({ postId: id });
    this.isConfirmModalVisible.set(true);
  }

  handleConfirmAction() {
    const action = this.confirmAction();
    if (action) {
      this.fellowshipService.deactivatePost(action.postId).subscribe({
        next: () => {
          this.fellowshipService.loadPosts(this.fellowshipName());
        },
        error: (err) => {
          console.error('Error deactivating post:', err);
          alert('Failed to delete post. Please try again.');
        }
      });
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalVisible.set(false);
    this.confirmAction.set(null);
  }

  getFirstParagraph(post: FellowshipPost): string {
    const textContext = post.content ? post.content.replace(/<[^>]*>?/gm, ' ') : '';
    return textContext.substring(0, 150) + (textContext.length > 150 ? '...' : '');
  }
}
