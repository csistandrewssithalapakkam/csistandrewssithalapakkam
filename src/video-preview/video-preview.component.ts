import { Component, ChangeDetectionStrategy, input, output, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-preview',
  imports: [],
  templateUrl: './video-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPreviewComponent {
  videoUrl = input.required<string>();
  close = output<void>();
  // Fix: Explicitly type the injected DomSanitizer service.
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  sanitizedVideoUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.videoUrl();
    if (!url) return null;

    // Extract file ID from Google Drive URL and create an embeddable URL
    // e.g., https://drive.google.com/file/d/FILE_ID/preview
    const parts = url.split('/');
    const fileIdIndex = parts.indexOf('d') + 1;
    if (fileIdIndex > 0 && fileIdIndex < parts.length) {
      const fileId = parts[fileIdIndex];
      const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    
    return null; // Return null if URL is not a valid GDrive link
  });


  onClose() {
    this.close.emit();
  }
}
