import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // Fix: Add explicit type for injected service.
  private fb: FormBuilder = inject(FormBuilder);
  // Fix: Add explicit type for injected service.
  private authService: AuthService = inject(AuthService);

  hasError = signal(false);

  loginForm = this.fb.group({
    username: ['admin', Validators.required],
    password: ['admin@123', Validators.required],
  });

  onSubmit() {
    this.hasError.set(false);
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.getRawValue();
      if (!this.authService.login(username!, password!)) {
        this.hasError.set(true);
      }
    }
  }
}
