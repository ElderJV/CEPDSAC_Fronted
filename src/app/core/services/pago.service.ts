import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoResponse, PagoCreateDTO } from '../models/matricula.model';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private base = `${environment.apiUrl}/pagos`;
  
  constructor(private http: HttpClient) {}

  registrarPago(dto: PagoCreateDTO): Observable<PagoResponse> {
    console.log('PagoService.registrarPago -> POST', this.base, dto);
    return this.http.post<PagoResponse>(this.base, dto);
  }

  listarPagosPorMatricula(idMatricula: number): Observable<PagoResponse[]> {
    const url = `${this.base}/matricula/${idMatricula}`;
    console.log('PagoService.listarPagosPorMatricula -> GET', url);
    return this.http.get<PagoResponse[]>(url);
  }

  actualizarPago(id: number, dto: any): Observable<PagoResponse> {
    const url = `${this.base}/${id}`;
    console.log('PagoService.actualizarPago -> PUT', url, dto);
    return this.http.put<PagoResponse>(url, dto);
  }

  listarPagosPorDevolver(): Observable<PagoResponse[]> {
    const url = `${this.base}/por-devolver`;
    console.log('PagoService.listarPagosPorDevolver -> GET', url);
    return this.http.get<PagoResponse[]>(url);
  }

  marcarComoDevuelto(id: number): Observable<void> {
    const url = `${this.base}/${id}/devolver`;
    console.log('PagoService.marcarComoDevuelto -> POST', url);
    return this.http.post<void>(url, {});
  }
}
