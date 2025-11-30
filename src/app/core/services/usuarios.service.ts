import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Usuario, UsuarioToggle } from '../models/usuarios.model';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  //Listamos a todos los usuarios
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar`);
  }

  //Listamos usuarios por su rol
  listarPorRol(rol: 'ALUMNO' | 'DOCENTE'): Observable<Usuario[]> {
    console.info('UsuariosService.listarPorRol -> rol:', rol);
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar/${rol}`);
  }

  // listar paginado para alumnos
  listarAlumnosPaginado(page: number, size: number, buscar: string = '', soloConMatricula: boolean = false): Observable<Page<Usuario>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('soloConMatricula', soloConMatricula.toString());
    
    if (buscar) {
      params = params.set('buscar', buscar);
    }

    return this.http.get<Page<Usuario>>(`${this.apiUrl}/alumnos`, { params });
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario);
  }

  actualizar(id: number, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarParcial(id: number, data: Partial<UsuarioToggle>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, data);
  }
}
