import { Injectable, signal } from '@angular/core';
import { AuthTokens } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';

  public readonly isAuthenticated = signal<boolean>(this.hasAccessToken());

  public saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
    this.isAuthenticated.set(true);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  public saveAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    this.isAuthenticated.set(true);
  }

  public clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticated.set(false);
  }

  private hasAccessToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }
}
