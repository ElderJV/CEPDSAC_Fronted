import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  CursoDiplomado,
  CursoDetalle,
  CursoDiplomadoViewAdmin,
} from '../models/curso-diplomado.model';
import { Categoria } from '../models/categoria.model';
import { ProgramacionCursoSimpleDTO } from '../models/programacion.model';

@Injectable({
  providedIn: 'root',
})
export class CursoDiplomadoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cursos-diplomados`;
  private apiUrlCategorias = `${environment.apiUrl}/categorias`;
  private apiUrlProgramacion = `${environment.apiUrl}/programacioncursos`;

  listarCursos(): Observable<CursoDiplomadoViewAdmin[]> {
    return this.http.get<CursoDiplomadoViewAdmin[]>(`${this.apiUrl}/listar-cursos`);
  }

  listarDiplomados(): Observable<CursoDiplomadoViewAdmin[]> {
    return this.http.get<CursoDiplomadoViewAdmin[]>(`${this.apiUrl}/listar-diplomados`);
  }

  listarCursosAdmin(): Observable<CursoDiplomadoViewAdmin[]> {
    return this.http.get<CursoDiplomadoViewAdmin[]>(`${this.apiUrl}/listar-cursos-admin`);
  }

  listarDiplomadosAdmin(): Observable<CursoDiplomadoViewAdmin[]> {
    return this.http.get<CursoDiplomadoViewAdmin[]>(`${this.apiUrl}/listar-diplomados-admin`);
  }

  obtenerDetalle(id: number): Observable<CursoDetalle> {
    return this.http.get<CursoDetalle>(`${this.apiUrl}/detalle/${id}`);
  }

  listar(): Observable<CursoDiplomadoViewAdmin[]> {
    return this.http.get<CursoDiplomadoViewAdmin[]>(`${this.apiUrl}/listar`);
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

  actualizar(
    id: number,
    curso: Partial<CursoDiplomado>
  ): Observable<CursoDiplomado> {
    return this.http.put<CursoDiplomado>(
      `${this.apiUrl}/actualizar/${id}`,
      curso
    );
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrlCategorias}/listar`);
  }


  //TEACHER
  listarCursosDocente(): Observable<CursoDiplomadoViewAdmin[]> {
    return this.http.get<CursoDiplomadoViewAdmin[]>(`${this.apiUrl}/listar-cursos-docente`);
  } 

  listarDiplomadosDocente(): Observable<CursoDiplomadoViewAdmin[]> {
    return this.http.get<CursoDiplomadoViewAdmin[]>(`${this.apiUrl}/listar-diplomados-docente`);
  } 

  listarProgramacionesPorCursoDocente(idCurso: number): Observable<ProgramacionCursoSimpleDTO[]> {
    return this.http.get<ProgramacionCursoSimpleDTO[]>(`${this.apiUrlProgramacion}/docente/curso/${idCurso}`);
  }
  
}
