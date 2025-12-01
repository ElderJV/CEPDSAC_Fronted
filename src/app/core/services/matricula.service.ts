import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatriculaCreateDTO, MatriculaResponseDTO, MatriculaDetalleResponse, MatriculaListResponse } from '../models/matricula.model';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class MatriculaService {
  private base = `${environment.apiUrl}/matriculas`;
  constructor(private http: HttpClient, private authService: AuthService) {}

  crear(dto: MatriculaCreateDTO): Observable<MatriculaResponseDTO> {
    console.log('MatriculaService.crear -> POST', this.base, dto);
    try {
      const token = this.authService.getToken();
      if (token) {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        console.log('MatriculaService.crear -> enviando Authorization header');
        return this.http.post<MatriculaResponseDTO>(this.base, dto, { headers });
      }
    } catch (e) {
      console.warn('MatriculaService.crear: error leyendo token desde AuthService', e);
    }
    return this.http.post<MatriculaResponseDTO>(this.base, dto);
  }

  notificarPago(idMatricula: number) {
    const url = `${this.base}/${idMatricula}/notificar-pago`;
    console.log('MatriculaService.notificarPago -> POST', url);
    return this.http.post(url, {});
  }

  //metodos Admin para gestion 
  obtenerDetalleCompleto(idMatricula: number): Observable<MatriculaDetalleResponse> {
    const url = `${this.base}/${idMatricula}/detalle`;
    console.log('MatriculaService.obtenerDetalleCompleto -> GET', url);
    return this.http.get<MatriculaDetalleResponse>(url);
  }

  listarMatriculasAdmin(page: number = 0, size: number = 10, dni: string = '', estado: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (dni) {
      params = params.set('dni', dni);
    }
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<any>(`${this.base}/admin/listar`, { params });
  }

  confirmarPago(idMatricula: number): Observable<void> {
    return this.http.put<void>(`${this.base}/${idMatricula}/confirmar-pago`, {});
  }

  cancelarMatricula(id: number): Observable<MatriculaResponseDTO> {
    return this.http.put<MatriculaResponseDTO>(`${this.base}/${id}/cancelar`, {});
  }

  aplicarDescuento(id: number, idDescuento: number): Observable<MatriculaResponseDTO> {
    return this.http.put<MatriculaResponseDTO>(`${this.base}/${id}/aplicar-descuento`, { idDescuento });
  }

  cancelarMatriculasPorProgramacion(idProgramacionCurso: number, motivo: string): Observable<MatriculaResponseDTO[]> {
    const params = new HttpParams().set('motivo', motivo);
    const url = `${this.base}/cancelar-por-programacion/${idProgramacionCurso}`;
    console.log('MatriculaService.cancelarMatriculasPorProgramacion -> POST', url, params.toString());
    return this.http.post<MatriculaResponseDTO[]>(url, {}, { params });
  }

  listarPorAlumno(dni: number): Observable<MatriculaListResponse[]> {
    const url = `${this.base}/alumno/${dni}`;
    console.log('MatriculaService.listarPorAlumno -> GET', url);
    return this.http.get<MatriculaListResponse[]>(url);
  }
}
