import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { GalleryService } from '../../gallery/gallery.service';
import { AuthService } from '../auth.service';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  // Fix: Add explicit type for injected service.
  private fb: FormBuilder = inject(FormBuilder);
  // Fix: Add explicit type for injected service.
  galleryService: GalleryService = inject(GalleryService);
  // Fix: Add explicit type for injected service.
  authService: AuthService = inject(AuthService);

  addImageForm = this.fb.group({
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
  });

  addPhoto() {
    if (this.addImageForm.valid) {
      const { imageUrl } = this.addImageForm.getRawValue();
      this.galleryService.addImage(imageUrl!);
      this.addImageForm.reset();
    }
  }

  logout() {
    this.authService.logout();
  }
}
