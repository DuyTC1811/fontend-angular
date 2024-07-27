import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { LoginReq } from '../../core/models/login-req';
import { LoginResp } from '../../core/models/login-resp';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public loginForm: LoginReq = {
    username: '',
    password: '',
  };

  public isLoggedIn = false;
  public isLoginFailed = false;
  public errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  public async onSubmit(): Promise<void> {
    const loginReq: LoginReq = {
      username: this.loginForm.username,
      password: this.loginForm.password,
    };

    try {
      
      const response: LoginResp = await lastValueFrom(
        this.authService.login(loginReq)
      );

      console.log('Login successful', response);
    } catch (error) {
      console.log('Login failed', error);
    }
  }
}
