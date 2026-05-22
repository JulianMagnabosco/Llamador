import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  const router = inject(Router);
  const service = inject(AuthService);
  if (isPlatformBrowser(platformId)) {
    let existUser = localStorage.getItem('app.user');
    if (
      existUser &&
      !req.url.includes('signin') &&
      !req.url.includes('signup')
    ) {
      req = req.clone({
        withCredentials: true,
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) =>
      handleErrorRes(error, router, service)
    )
  );
};

export function handleErrorRes(
  error: HttpErrorResponse,
  router: Router,
  service: AuthService
): Observable<never> {
  if (error.status === 401 || error.status === 403) {
    service.deleteData();
    if (!error.url?.includes('logout')) {
      service.logout().subscribe();
    }

    router.navigate(['/login']);
    return throwError(() => new Error('Unauthorized'));
  }
  return throwError(() => error);
}
