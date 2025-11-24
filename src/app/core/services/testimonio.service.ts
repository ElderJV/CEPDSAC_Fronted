import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Testimonio } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/testimonios`;

  obtenerTodos(): Observable<Testimonio[]> {
    return this.http.get<Testimonio[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Testimonio> {
    return this.http.get<Testimonio>(`${this.apiUrl}/${id}`);
  }

  aprobar(id: number, aprobado: boolean): Observable<Testimonio> {
    return this.http.put<Testimonio>(`${this.apiUrl}/${id}/aprobacion`, {
      estadoAprobado: aprobado
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
