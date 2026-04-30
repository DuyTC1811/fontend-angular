import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignupReq } from '../models/signup-req';
import { Observable, tap } from 'rxjs';
import { LoginReq } from '../models/login-req';
import { LoginResp } from '../models/login-resp';
import { SignupResp } from '../models/signup-resp';
import { AuthTokens, RefreshTokenReq, RefreshTokenResp } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = 'http://localhost:8080/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  public signup(signUp: SignupReq): Observable<SignupResp> {
    return this.http.post<SignupResp>(`${AUTH_API}/signup`, {
      username: signUp.username,
      password: signUp.password,
      confirmPassword: signUp.confirmPassword,
      mobile: signUp.mobile,
      email: signUp.email,
    });
  }

  public login(login: LoginReq): Observable<LoginResp> {
    return this.http
      .post<LoginResp>(`${AUTH_API}/login`, {
        username: login.username,
        password: login.password,
      })
      .pipe(
        tap((response: AuthTokens) => {
          this.tokenStorage.saveTokens(response);
        })
      );
  }

  public refreshToken(refreshToken: string): Observable<RefreshTokenResp> {
    const request: RefreshTokenReq = {
      refreshToken,
    };

    return this.http.post<RefreshTokenResp>(
      `${AUTH_API}/refresh-token`,
      request,
      httpOptions
    );
  }

  public logout(): Observable<void> {
    this.tokenStorage.clearTokens();
    return this.http.post<void>(`${AUTH_API}/logout`, {}, httpOptions);
  }
}
