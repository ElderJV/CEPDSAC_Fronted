import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response.model';

//servicio para manejo de errores HTTP
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  //extraer mensajes de error dentro del response, fielderror
  getErrorMessage(error: HttpErrorResponse, defaultMessage: string = 'Ha ocurrido un error'): string {
    const backendError = error.error as ErrorResponse;
    if (backendError?.message) {
      const sanitized = this.sanitizeMessage(backendError.message);
      if (this.isValidMessage(sanitized)) {
        return sanitized;
      }
    }
    //si solo llega un string directo
    if (typeof error.error === 'string') {
      const sanitized = this.sanitizeMessage(error.error);
      if (this.isValidMessage(sanitized)) {
        return sanitized;
      }
    }
    return this.getMessageByStatusCode(error.status) || defaultMessage;
  }

  //get msj segun codigo de estado
  private getMessageByStatusCode(status: number): string {
    const messages: { [key: number]: string } = {
      0: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      400: 'Solicitud inválida. Verifica los datos ingresados.',
      401: 'No estás autenticado. Inicia sesión nuevamente.',
      403: 'Acceso denegado. No tienes permisos para esta acción.',
      404: 'Recurso no encontrado.',
      409: 'Conflicto con los datos existentes.',
      422: 'Datos no procesables. Verifica la información.',
      429: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.',
      500: 'Error interno del servidor. Intenta más tarde.',
      502: 'Servidor no disponible. Intenta más tarde.',
      503: 'Servicio temporalmente no disponible.'
    };
    return messages[status] || `Error ${status}. Intenta nuevamente.`;
  }

  // validacion de mensaje
  private isValidMessage(message: string): boolean {
    if (!message || message.length === 0) return false;
    if (message.length > 500) return false;
    // Rechazar mensajes que parezcan stack traces o codigo,, ATAQUE XSS
    const suspiciousPatterns = [
      /Exception/i,
      /at [a-zA-Z.]+\(/,  // Stack trace pattern
      /\[\w+:\d+\]/,      // File references
      /<script/i,
      /javascript:/i
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(message));
  }

  // sanitiza mensajes XSS
  private sanitizeMessage(message: string): string {
    if (!message) return '';
    return message
      // Eliminar tags HTML
      .replace(/<[^>]*>/g, '')
      // Eliminar javascript: URLs
      .replace(/javascript:/gi, '')
      // Eliminar event handlers (onclick, onerror, etc)
      .replace(/on\w+\s*=/gi, '')
      // Eliminar data: URLs (pueden contener scripts)
      .replace(/data:/gi, '')
      // Limitar longitud
      .substring(0, 500)
      .trim();
  }

  //ERRORES D VALIDACION
  getValidationErrors(error: HttpErrorResponse): { [key: string]: string } {
    const backendError = error.error as ErrorResponse;
    return backendError?.validationErrors || {};
  }

  isNetworkError(error: HttpErrorResponse): boolean {
    return error.status === 0;
  }

  isAuthenticationError(error: HttpErrorResponse): boolean {
    return error.status === 401;
  }

  isPermissionError(error: HttpErrorResponse): boolean {
    return error.status === 403;
  }
}
