import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BypassService {
  isUnlocked = signal<boolean>(false);
  private readonly unlockKey = 'isSiteUnlocked';

  constructor() {
    // Check session storage on initialization
    if (typeof sessionStorage !== 'undefined') {
      const isUnlockedInStorage = sessionStorage.getItem(this.unlockKey);
      if (isUnlockedInStorage === 'true') {
        this.isUnlocked.set(true);
      }
    }
  }

  unlock(password: string): boolean {
    if (password === 'Welcome@789') {
      this.isUnlocked.set(true);
      if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(this.unlockKey, 'true');
      }
      return true;
    }
    return false;
  }
}
