import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface TipoIdentificacion {
  idTipoIdentificacion: number;
  nombre: string;
}

export interface TipoIdentificacionInicial {
  idTipoIdentificacion: number;
  iniciales: string;
}

@Injectable({ providedIn: 'root' })
export class TipoIdentificacionService {
  constructor(private http: HttpClient) {}

  getTipos(): Observable<TipoIdentificacion[]> {
    return this.http.get<TipoIdentificacion[]>(`${environment.apiUrl}/tipos-identificacion`);
  }

  getIniciales(): Observable<TipoIdentificacionInicial[]> {
    return this.http.get<TipoIdentificacionInicial[]>(`${environment.apiUrl}/tipos-identificacion/iniciales`);
  }
}
