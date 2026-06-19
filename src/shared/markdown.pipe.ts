import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Since 'marked' is loaded from a CDN, declare it to TypeScript
declare var marked: {
  parse(markdown: string, options?: object): string;
};

@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    // Custom transformation for highlights before parsing
    const processedValue = value.replace(/==(.*?)==/g, '<mark>$1</mark>');

    // Use the 'marked' library to convert markdown to HTML
    // Enable GFM and line breaks to respect newlines from the textarea
    const html = marked.parse(processedValue, { breaks: true, gfm: true });
    
    // Sanitize the HTML to prevent XSS attacks
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
