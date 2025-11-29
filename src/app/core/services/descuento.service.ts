import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { Descuento, DescuentoCreateDTO, DescuentoUpdateDTO, DescuentoAplicacion, DescuentoAplicacionCreateDTO } from '../models/descuento.model';

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/descuentos`;
  private apiAplicacionUrl = `${environment.apiUrl}/aplicaciondescuento`;

  // --- Descuentos ---

  listar(): Observable<Descuento[]> {
    return this.http.get<Descuento[]>(`${this.apiUrl}/listar`);
  }

  obtener(id: number): Observable<Descuento> {
    return this.http.get<Descuento>(`${this.apiUrl}/obtener/${id}`);
  }

  crear(dto: DescuentoCreateDTO): Observable<Descuento> {
    return this.http.post<Descuento>(`${this.apiUrl}/crear`, dto);
  }

  actualizar(dto: DescuentoUpdateDTO): Observable<Descuento> {
    return this.http.put<Descuento>(`${this.apiUrl}/actualizar`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  //aplicaciones de descuentos  
  listarAplicaciones(): Observable<DescuentoAplicacion[]> {
    return this.http.get<DescuentoAplicacion[]>(`${this.apiAplicacionUrl}/listar`);
  }

  obtenerAplicacion(id: number): Observable<DescuentoAplicacion> {
    return this.http.get<DescuentoAplicacion>(`${this.apiAplicacionUrl}/obtener/${id}`);
  }

  crearAplicacion(dto: DescuentoAplicacionCreateDTO): Observable<DescuentoAplicacion> {
    return this.http.post<DescuentoAplicacion>(`${this.apiAplicacionUrl}/crear`, dto);
  }

  actualizarAplicacion(id: number, dto: DescuentoAplicacionCreateDTO): Observable<DescuentoAplicacion> {
    return this.http.put<DescuentoAplicacion>(`${this.apiAplicacionUrl}/actualizar/${id}`, dto);
  }

  eliminarAplicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAplicacionUrl}/eliminar/${id}`);
  }
}
