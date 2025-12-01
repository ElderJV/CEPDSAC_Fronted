import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { Categoria, CategoriaCreateDTO, CategoriaUpdateDTO } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categorias`;

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/listar`);
  }

  listarActivas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/activas`);
  }

  obtener(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/obtener/${id}`);
  }

  crear(dto: CategoriaCreateDTO): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/crear`, dto);
  }

  actualizar(dto: CategoriaUpdateDTO): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/actualizar`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  cambiarEstado(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/cambiar-estado/${id}`, {});
  }
}
