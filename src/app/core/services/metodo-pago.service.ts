import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { MetodoPago, MetodoPagoRequestDTO } from '../models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiUrl = `${environment.apiUrl}/metodos-pago`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.apiUrl}`);
  }

  obtenerActivos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.apiUrl}/activos`);
  }

  obtenerPorId(id: number): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.apiUrl}/${id}`);
  }

  crear(dto: MetodoPagoRequestDTO): Observable<MetodoPago> {
    return this.http.post<MetodoPago>(`${this.apiUrl}`, dto);
  }

  actualizar(id: number, dto: MetodoPagoRequestDTO): Observable<MetodoPago> {
    return this.http.put<MetodoPago>(`${this.apiUrl}/${id}`, dto);
  }

  cambiarEstado(id: number, activo: boolean): Observable<MetodoPago> {
    return this.http.patch<MetodoPago>(`${this.apiUrl}/${id}/estado`, { activo });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  subirImagenQR(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{url: string}>(`${this.apiUrl}/upload-qr`, formData);
  }
}
