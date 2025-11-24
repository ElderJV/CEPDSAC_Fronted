import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ConfiguracionContacto } from '../models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionContactoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/configuracion/contacto`;

  obtener(): Observable<ConfiguracionContacto> {
    return this.http.get<ConfiguracionContacto>(this.apiUrl);
  }

  actualizar(configuracion: ConfiguracionContacto): Observable<ConfiguracionContacto> {
    return this.http.put<ConfiguracionContacto>(this.apiUrl, configuracion);
  }
}
