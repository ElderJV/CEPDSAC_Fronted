import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error-handler.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error) => {

      // Log automático en desarrollo (si quieres hacer el check de prod, aquí)
      console.error('HTTP Error:', {
        url: req.url,
        status: error.status,
        message: error.message,
        error: error.error,
      });

      // Manejar errores de autenticación globalmente
      if (errorHandler.isAuthenticationError(error)) {
        localStorage.removeItem('jwt_token');
        router.navigate(['/login'], {
          queryParams: { sessionExpired: 'true' },
        });
      }

      return throwError(() => error);
    })
  );
};
