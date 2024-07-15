import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignupReq } from '../../core/models/signup-req';
import { AuthService } from '../../core/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { SignupResp } from '../../core/models/signup-resp';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public signUp: SignupReq = {
    username: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    email: '',
  };

  constructor(private authService: AuthService) {}

  public async onSubmit(): Promise<void> {
    const signUp: SignupReq = {
      username: this.signUp.username,
      password: this.signUp.password,
      confirmPassword: this.signUp.confirmPassword,
      mobile: this.signUp.mobile,
      email: this.signUp.email,
    };

    try {
      const response: SignupResp = await lastValueFrom(
        this.authService.signup(signUp)
      );

      console.log('Login successful', response);
    } catch (error) {
      console.log('Login failed', error);
    }
  }
}
