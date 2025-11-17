import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CursoDiplomado, CursoDetalle } from '../models/curso-diplomado.model';

@Injectable({
  providedIn: 'root',
})
export class CursoDiplomadoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cursos-diplomados`;

  listarIndex(): Observable<CursoDiplomado[]> {
    return this.http.get<CursoDiplomado[]>(`${this.apiUrl}/listar-index`);
  }

  listarCursos(): Observable<CursoDiplomado[]> {
    return this.http.get<CursoDiplomado[]>(`${this.apiUrl}/listar-cursos`);
  }

  listarDiplomados(): Observable<CursoDiplomado[]> {
    return this.http.get<CursoDiplomado[]>(`${this.apiUrl}/listar-diplomados`);
  }

  obtenerDetalle(id: number): Observable<CursoDetalle> {
    return this.http.get<CursoDetalle>(`${this.apiUrl}/detalle/${id}`);
  }

  listar(): Observable<CursoDiplomado[]> {
    return this.http.get<CursoDiplomado[]>(`${this.apiUrl}/listar`);
  }

  obtenerPorId(id: number): Observable<CursoDiplomado> {
    return this.http.get<CursoDiplomado>(`${this.apiUrl}/obtener/${id}`);
  }

  crear(curso: Partial<CursoDiplomado>): Observable<CursoDiplomado> {
    return this.http.post<CursoDiplomado>(`${this.apiUrl}/crear`, curso);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
