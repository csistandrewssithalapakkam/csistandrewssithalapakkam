import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LaunchPopupComponent } from './launch-popup.component';

@Injectable({
    providedIn: 'root'
})
export class LaunchPopupService {
    private dialog = inject(MatDialog);
    private hasShownInSession = false;

    private readonly EXPIRATION_DATE = new Date('2026-05-03T23:59:59');

    showIfNeeded(): void {
        if (this.hasShownInSession) return;

        const now = new Date();
        if (now > this.EXPIRATION_DATE) return;

        // Show popup
        this.dialog.open(LaunchPopupComponent, {
            maxWidth: '90vw',
            maxHeight: '90vh',
            panelClass: 'launch-popup-container',
            backdropClass: 'launch-popup-backdrop',
            autoFocus: false
        });

        this.hasShownInSession = true;
    }
}
