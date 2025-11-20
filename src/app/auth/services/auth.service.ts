import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface LoginResponse {
  token: string;
  //podriamos implementar el user en la respuesta, o el rol o name
  user?: any;
  rol?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      correo,
      password,
    });
  }

  register(payload: any) {
    return this.http.post(`${environment.apiUrl}/usuarios`, payload);
  }

  forgotPassword(correo: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { correo });
  }

  resetPassword(token: string, nuevaPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, nuevaPassword });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role');
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('jwt_token');
  }

  setToken(token: string | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (token === null) {
      localStorage.removeItem('jwt_token');
    } else {
      localStorage.setItem('jwt_token', token);
    }
  }

  /**
   * Guardar/limpiar rol de usuario en localStorage (solo en browser)
   */
  setRole(role: string | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (role === null) {
      localStorage.removeItem('user_role');
    } else {
      localStorage.setItem('user_role', role);
    }
  }

  /**
   * Obtener rol del usuario desde localStorage (solo en browser)
   */
  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  getTokenPayload(token?: string): any | null {
    const t = token ?? this.getToken();
    if (!t) return null;
    try {
      const parts = t.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch (e) {
      return null;
    }
  }

  isTokenValid(token?: string): boolean {
    const payload = this.getTokenPayload(token);
    if (!payload) return false;
    if (!payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }
}
