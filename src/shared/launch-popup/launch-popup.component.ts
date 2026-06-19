import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-launch-popup',
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <div class="popup-wrapper">
      <!-- Close Button -->
      <button mat-mini-fab (click)="close()" class="close-btn" aria-label="Close">
        <mat-icon>close</mat-icon>
      </button>

      <!-- Clickable Image -->
      <div class="image-wrapper shadow-2xl rounded-2xl overflow-hidden cursor-pointer animate-fade-in-scale"
           (click)="viewDetails()">
        <img
          src="https://drive.google.com/thumbnail?id=1bIpTXV4ovSLUfj3hrmDJS95UoXs2BK_P&sz=w1600"
          alt="VBS 2026 – Come to Jesus"
          class="display-image"
        />
      </div>

      <!-- CTA strip -->
      <div class="cta-strip" (click)="viewDetails()">
        <mat-icon style="font-size:18px;width:18px;height:18px">open_in_new</mat-icon>
        Click here to view VBS 2026 details
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      overflow: visible !important;
    }

    .popup-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .close-btn {
      position: absolute;
      top: -12px;
      right: -12px;
      z-index: 50;
      background-color: #ffffff !important;
      color: #333333 !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
      width: 36px !important;
      height: 36px !important;
      transition: all 0.2s ease-in-out !important;
    }
    .close-btn:hover { transform: scale(1.1) rotate(90deg); }

    .image-wrapper {
      max-width: 85vw;
      max-height: 70vh;
      background: #1e0040;
      transition: transform 0.2s;
    }
    .image-wrapper:hover { transform: scale(1.01); }

    .display-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      display: block;
    }

    .cta-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 10px;
      background: linear-gradient(90deg, #7c3aed, #4f46e5);
      color: white;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 24px;
      border-radius: 999px;
      cursor: pointer;
      letter-spacing: 0.02em;
      box-shadow: 0 4px 16px rgba(79,70,229,0.4);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .cta-strip:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79,70,229,0.5);
    }

    .animate-fade-in-scale {
      animation: fadeInScale 0.45s cubic-bezier(0.165, 0.84, 0.44, 1.0) forwards;
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }

    ::ng-deep .launch-popup-container .mat-mdc-dialog-surface {
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      overflow: visible !important;
    }
    ::ng-deep .launch-popup-backdrop {
      background-color: rgba(0,0,0,0.55) !important;
      backdrop-filter: blur(6px) !important;
      -webkit-backdrop-filter: blur(6px) !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchPopupComponent {
  private dialogRef = inject(MatDialogRef<LaunchPopupComponent>);
  private router = inject(Router);

  close(): void {
    this.dialogRef.close();
  }

  viewDetails(): void {
    this.dialogRef.close();
    this.router.navigate(['/vbs2026']);
  }
}
