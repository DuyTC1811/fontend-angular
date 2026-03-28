import {Injectable}              from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable}              from "rxjs";

const AUTH_API = 'http://localhost:8080/api/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class TwoFactorService {

  constructor(private http: HttpClient) {
  }

  // Bật 2FA — trả về QR code / secret key
  enable2FA(): Observable<Blob> {
    return this.http.post(AUTH_API + '2fa/enable', {}, {
      responseType: 'blob'
    });
  }

  // Xác nhận setup 2FA lần đầu (user nhập code từ app authenticator)
  verify2FASetup(code: string): Observable<any> {
    return this.http.post(AUTH_API + '2fa/verify-setup', {code}, httpOptions);
  }

  // Xác thực TOTP code khi login
  verify2FA(code: string): Observable<any> {
    return this.http.post(AUTH_API + '2fa/verify', {code}, httpOptions);
  }

  // Tắt 2FA
  disable2FA(code: string): Observable<any> {
    return this.http.post(AUTH_API + '2fa/disable', {code}, httpOptions);
  }
}
