import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error-handler.service';

//interceptor global maneja errores http, redirige en 401 y loguea errores
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //logging automatico en desarrollo
        if (!this.isProduction()) {
          console.error('HTTP Error:', {
            url: request.url,
            status: error.status,
            message: error.message,
            error: error.error
          });
        }
        //manejar errores de autenticacion globalmente
        if (this.errorHandler.isAuthenticationError(error)) {
          this.handleAuthenticationError();
        }
        //propagar el error para que el componente lo maneje
        return throwError(() => error);
      })
    );
  }

  private handleAuthenticationError(): void {
    //limpiar token y redirigir al login
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login'], {
      queryParams: { sessionExpired: 'true' }
    });
  }

  private isProduction(): boolean {
    return false; //environment.production xd
  }
}
