import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Signup } from '../models/signup';
import { Observable } from 'rxjs';
import { Login } from '../models/login';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public signup(singup: Signup): Observable<Signup> {
    return this.http.post<Signup>(
      `${AUTH_API}'singup'`,
      {
        username: singup.username,
        password: singup.password,
        confirmPassword: singup.confirmPassword,
      },
      httpOptions
    );
  }

  public login(login: Login): Observable<Login> {
    return this.http.post<Login>(`${AUTH_API}'login'`, {
      username: login.username,
      password: login.password,
    });
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${AUTH_API}'logout'`, {}, httpOptions);
  }
}
