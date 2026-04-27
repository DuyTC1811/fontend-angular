import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LoginReq } from '../../core/models/login-req';
import { LoginResp } from '../../core/models/login-resp';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly loginModel = signal<LoginReq>({
    username: '',
    password: '',
  });

  public readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'Username không được để trống',
    });

    required(schemaPath.password, {
      message: 'Password không được để trống',
    });
  });

  public readonly submitted = signal(false);
  public readonly isSubmitting = signal(false);
  public readonly isLoginFailed = signal(false);
  public readonly errorMessage = signal('');

  public async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    this.submitted.set(true);
    this.isLoginFailed.set(false);
    this.errorMessage.set('');

    if (this.loginForm.username().invalid() || this.loginForm.password().invalid()) {
      return;
    }

    const loginReq: LoginReq = this.loginModel();

    try {
      this.isSubmitting.set(true);

      const response: LoginResp = await lastValueFrom(
        this.authService.login(loginReq),
      );

      console.log('Login successful', response);

      await this.router.navigate(['/home']);

    } catch (error: any) {
      console.log('Login failed', error);

      this.isLoginFailed.set(true);
      this.errorMessage.set(
        error?.error?.description ||
          error?.error?.message ||
          'Đăng nhập thất bại',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
  public shouldShowUsernameError(): boolean {
    const username = this.loginForm.username();

    return username.invalid() && (username.touched() || this.submitted());
  }

  public shouldShowPasswordError(): boolean {
    const password = this.loginForm.password();

    return password.invalid() && (password.touched() || this.submitted());
  }
}
