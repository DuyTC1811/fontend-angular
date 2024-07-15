import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupReq } from '../models/signup-req';
import { Observable } from 'rxjs';
import { LoginReq } from '../models/login-req';
import { LoginResp } from '../models/login-resp';
import { SignupResp } from '../models/signup-resp';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public signup(singup: SignupReq): Observable<SignupResp> {
    return this.http.post<SignupResp>(
      `${AUTH_API}signup`,
      {
        username: singup.username,
        password: singup.password,
        confirmPassword: singup.confirmPassword,
        mobile: singup.mobile,
        email: singup.email,
      });
  }

  public login(login: LoginReq): Observable<LoginResp> {
    return this.http.post<LoginResp>(`${AUTH_API}login`, {
      username: login.username,
      password: login.password,
    });
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${AUTH_API}logout`, {}, httpOptions);
  }
}
