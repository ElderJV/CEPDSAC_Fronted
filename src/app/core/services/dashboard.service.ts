import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface DashboardStats {
  totalAlumnos: number;
  totalCursos: number;
  ingresosTotales: number;
  matriculasActivas: number;
  ingresosPorMes: { mes: string; total: number }[];
  matriculasPorEstado: { [key: string]: number };
  ultimasMatriculas: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/dashboard`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}
