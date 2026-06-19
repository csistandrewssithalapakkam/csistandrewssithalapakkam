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
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);

  hasError = signal(false);
  errorMessage = signal<string>('');
  isLoading = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.hasError.set(false);
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { username, password } = this.loginForm.getRawValue();
      this.authService.login(username!, password!).subscribe(res => {
        this.isLoading.set(false);
        if (!res.success) {
          this.hasError.set(true);
          this.errorMessage.set(res.message || 'Invalid credentials');
        }
      });
    }
  }
}
