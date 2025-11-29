import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ProgramacionCursoResponse } from '../models/programacion-curso';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionCursoService {
  private apiUrl = `${environment.apiUrl}/programacioncursos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ProgramacionCursoResponse[]> {
    return this.http.get<ProgramacionCursoResponse[]>(this.apiUrl);
  }

  listarDisponibles(): Observable<ProgramacionCursoResponse[]> {
    return this.http.get<ProgramacionCursoResponse[]>(`${this.apiUrl}/disponibles`);
  }

  obtenerPorId(id: number): Observable<ProgramacionCursoResponse> {
    return this.http.get<ProgramacionCursoResponse>(`${this.apiUrl}/${id}`);
  }

  crear(programacion: any): Observable<ProgramacionCursoResponse> {
    return this.http.post<ProgramacionCursoResponse>(this.apiUrl, programacion);
  }

  actualizar(id: number, programacion: any): Observable<ProgramacionCursoResponse> {
    return this.http.put<ProgramacionCursoResponse>(`${this.apiUrl}/${id}`, programacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
