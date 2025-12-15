import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BypassService {
  // Reverted to a simple boolean signal, initialized to false.
  isUnlocked = signal<boolean>(false);
  private readonly unlockKey = 'isSiteUnlocked';
  private readonly password = 'Welcome@987';

  constructor() {
    // Constructor is now empty to ensure the coming soon page is always shown on startup.
    // The check for sessionStorage has been removed.
  }

  checkPassword(password: string): boolean {
    return password === this.password;
  }

  unlock(password: string): boolean {
    if (this.checkPassword(password)) {
      this.isUnlocked.set(true);
      // Persist the unlocked state in sessionStorage for subsequent visits within the same session.
      try {
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(this.unlockKey, 'true');
        }
      } catch (e) {
        // If storage fails, the app will still work for the current view, but won't remember on refresh.
        console.error('Could not write to sessionStorage:', e);
      }
      return true;
    }
    return false;
  }
}