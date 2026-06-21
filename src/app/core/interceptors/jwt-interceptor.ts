import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { AuthService } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isAuthRoute = req.url.includes('/api/auth/');
  const token = authService.getToken();

  if (token && !isAuthRoute) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
