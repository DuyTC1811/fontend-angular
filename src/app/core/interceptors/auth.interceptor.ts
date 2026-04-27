import { HttpInterceptorFn } from '@angular/common/http';
import { TokenStorageService } from '../services/token-storage.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenStorage = inject(TokenStorageService);
  const accessToken = tokenStorage.getAccessToken();

  if (!accessToken) {
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(authRequest);
};
