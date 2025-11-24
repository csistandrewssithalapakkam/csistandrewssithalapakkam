import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { HeroImagesService } from '../../hero/hero-images.service';

@Component({
  selector: 'app-banner-manager',
  imports: [ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './banner-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerManagerComponent {
  private fb = inject(FormBuilder);
  heroImagesService = inject(HeroImagesService);

  addImageForm = this.fb.group({
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
  });

  addPhoto() {
    if (this.addImageForm.valid) {
      const { imageUrl } = this.addImageForm.getRawValue();
      this.heroImagesService.addImage(imageUrl!);
      this.addImageForm.reset();
    }
  }

  removePhoto(imageUrl: string) {
    if (confirm('Are you sure you want to delete this banner image?')) {
      this.heroImagesService.removeImage(imageUrl);
    }
  }
}
